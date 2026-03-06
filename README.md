# gem-abac-poc

GEM 프로젝트의 ABAC(Attribute-Based Access Control) PoC 구현체입니다.
CASL 라이브러리 기반으로 NestJS 환경에서 속성 기반 접근 제어를 구현합니다.

## Tech Stack

- **Runtime**: Node.js + NestJS 10
- **Database**: MongoDB + Mongoose
- **Auth**: Passport (JWT, Local)
- **Access Control**: CASL (`@casl/ability`, `@casl/mongoose`)
- **Request Context**: `nestjs-cls` (AsyncLocalStorage)

## Project Structure

```
src/
├── domain/                    # 도메인 모듈
│   ├── auth/                  # 인증 (JWT, Local Strategy)
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
    ├── decorator/             # PublicRoute 등 공용 데코레이터
    └── events/                # EventEmitter 래퍼
```

## ABAC Design

### 권한 정책 구조

- **Group**: 역할(Role) 단위로 기본 권한을 정의 (e.g. Admin, Instructor, Student)
- **Policy**: 개별 사용자에게 추가/제한 권한을 부여
- **Effect**: `Allow` / `Deny` — Deny가 Allow를 항상 우선 (deny-overrides)

### Policy Rule 예시

```json
{
  "effect": "Allow",
  "action": "Course:Read",
  "subject": "Course",
  "conditions": { "spaceId": "space-001" }
}
```

`conditions`는 리소스의 속성과 매칭되며, CASL의 MongoDB-style 조건으로 변환됩니다.

### Guard 동작 방식

1. `@CheckPolicies()` 데코레이터로 엔드포인트에 필요한 권한을 선언
2. `AccessControlGuard`가 요청 시 사용자의 Group + Policy를 조합하여 CASL Ability를 생성
3. `PolicyHandlerFactory`가 생성한 핸들러로 권한 검증 수행

```typescript
@Post()
@CheckPolicies(
  PolicyHandlerFactory.createForScope({
    action: CourseAction.CREATE,
    subject: Subject.COURSE,
  }),
)
create(@Body() dto: CreateCourseDto) {
  return this.courseService.create(dto);
}
```

### Scope vs Resource

- **createForScope**: 목록 조회, 생성 등 특정 리소스 ID가 필요 없는 권한 검증
- **createForResource**: 단건 조회, 수정 등 URL 파라미터의 리소스 ID를 기반으로 검증

## Getting Started

### Prerequisites

- Node.js >= 18
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

# e2e tests
pnpm test:e2e

# coverage
pnpm test:cov
```

## License

MIT
