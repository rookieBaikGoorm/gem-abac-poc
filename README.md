# gem-abac-poc

GEM 프로젝트의 ABAC(Attribute-Based Access Control) PoC 구현체입니다.
CASL 라이브러리 기반으로 NestJS 환경에서 속성 기반 접근 제어를 구현합니다.

## Tech Stack

- **Runtime**: Node.js >= 24, NestJS 11
- **Database**: MongoDB + Mongoose 8
- **Auth**: Custom JWT Guard (`@nestjs/jwt` 직접 사용, Passport 미사용)
- **Access Control**: CASL (`@casl/ability` v6+, `@casl/mongoose` v8)
- **Request Context**: `nestjs-cls` (AsyncLocalStorage)
- **Lint**: ESLint 9 (flat config) + Prettier 3

## Project Structure

```
src/
├── domain/                    # 도메인 모듈
│   ├── auth/                  # 인증 (Custom JWT Guard)
│   ├── space/                 # Space (최상위 리소스)
│   ├── course/                # Course
│   ├── unit/                  # Unit
│   ├── submission/            # Submission
│   ├── user/                  # User
│   ├── group/                 # Group (역할 기반 권한 그룹)
│   └── policy/                # Policy (사용자별 권한 정책)
└── shared/                    # 공유 모듈
    ├── access-control/        # ABAC 핵심 모듈
    │   ├── constant/          # Action, Subject, Effect 상수
    │   ├── factory/           # CaslAbilityFactory
    │   ├── guard/             # AccessControlGuard, PolicyHandlerFactory
    │   ├── interface/         # AppAbility, PolicyRule 타입
    │   └── service/           # AccessControlService
    ├── auth-guard/            # JwtAuthGuard (Global)
    ├── decorator/             # PublicRoute 등 공용 데코레이터
    └── events/                # EventEmitter 래퍼
```

각 도메인 모듈은 **Controller → Service → Repository** 3계층 구조를 따릅니다.

- **Controller**: 라우팅 + `@CheckPolicies` 선언
- **Service**: 비즈니스 로직 + 자원 체크 (AccessControlService)
- **Repository**: 순수 Mongoose 데이터 접근 (인가 로직 미포함)

## ABAC Design

### 2-Layer 인가 아키텍처

Guard(1차: 권한 체크)와 Service(2차: 자원 체크)로 인가를 분리합니다.

```
Client → JwtAuthGuard → AccessControlGuard(1차) → Controller → Service(2차) → Repository → DB
```

| Layer | 역할 | CASL 호출 방식 |
|-------|------|---------------|
| **Guard** | 규칙 존재 여부 확인 (Condition 무시) | `ability.can(action, 'Subject')` — 문자열 Subject |
| **Service** | 실제 리소스에 대한 접근 가능 여부 확인 | `ability.can(action, subject('Subject', resource))` — 객체 Subject |

- Guard에서 "이 사용자에게 해당 Action을 수행할 수 있는 정책이 존재하는가?"를 확인
- Service에서 "이 특정 리소스에 대해 접근이 가능한가?"를 Condition까지 평가하여 확인

### 권한 정책 구조

- **Group**: 역할(Role) 단위로 기본 권한을 정의 (e.g. MANAGER, VIEWER, GUEST)
- **Policy**: 개별 사용자에게 추가/제한 권한을 부여 (userId + spaceId 기반)
- **Effect**: `Allow` / `Deny` — Deny가 Allow를 항상 우선 (deny-overrides)
- **병합 순서**: Group Allow → User Allow → Group Deny → User Deny (CASL은 뒤에 정의된 룰이 우선)

### Policy Rule 예시

```json
{
  "effect": "Allow",
  "subject": "Course",
  "actions": ["Read", "Update"],
  "resources": ["course-001", "course-002"],
  "condition": { "spaceId": "space-001" }
}
```

- `resources: ["*"]` → 전체 허용 (conditions 없음)
- `resources: ["id-001"]` → `{ id: { $in: ["id-001"] } }` 로 CASL conditions 자동 변환
- `condition`이 있으면 resources 조건과 병합

### Guard — 권한 체크

`@CheckPolicies()` 데코레이터와 `PolicyHandlerFactory.create()`로 선언적 권한 검증을 수행합니다.
Guard는 문자열 Subject로 규칙 존재만 확인하며, Condition은 평가하지 않습니다.

```typescript
@Get(':id')
@CheckPolicies(
  PolicyHandlerFactory.create({
    action: CourseAction.READ,
    subject: Subject.COURSE,
  }),
)
findOne(@Param('id') id: string) {
  return this.courseService.findOne(id);
}
```

### Service — 자원 체크

Service에서 `AccessControlService`를 통해 실제 리소스의 Condition까지 평가합니다.

```typescript
@Injectable()
export class CourseService {
  constructor(
    private readonly courseRepo: CourseRepository,
    private readonly accessControl: AccessControlService,
  ) {}

  // 목록 조회: DB 필터로 접근 가능한 리소스만 반환
  async findAll(spaceId: string) {
    const filter = this.accessControl.getAccessibleQuery({
      action: CourseAction.READ,
      subject: Subject.COURSE,
    });
    return this.courseRepo.findAll({ $and: [{ spaceId }, filter ?? {}] });
  }

  // 단건 조회: 리소스 로드 → Condition 평가
  async findOne(id: string) {
    const course = await this.courseRepo.findById(id);
    this.accessControl.authorize({
      action: CourseAction.READ,
      subject: Subject.COURSE,
      resource: course.toObject(),
    });
    return course;
  }
}
```

### Action / Subject 상수

모든 Action과 Subject는 타입 안전한 상수로 정의되어 있습니다.

```typescript
// manage, all 은 CASL reserved keyword — 반드시 소문자 사용
CrudAction.MANAGE  // 'manage' — 모든 Action의 슈퍼셋
Subject.ALL        // 'all' — 모든 Subject의 와일드카드

// 도메인별 Action
CourseAction.READ          // 'Read'
UnitAction.CLONE           // 'Clone'
UnitAction.LINK_SUBMISSION // 'LinkSubmission'
SubmissionAction.TOGGLE_LOGIN // 'ToggleLogin'
```

## Getting Started

### Prerequisites

- Node.js >= 24
- pnpm
- MongoDB

### Installation

```bash
pnpm install
```

### Running

```bash
# development
pnpm start:dev

# production
pnpm build
pnpm start:prod
```

### Testing

```bash
# unit tests
pnpm test

# coverage
pnpm test:cov
```

## License

MIT
