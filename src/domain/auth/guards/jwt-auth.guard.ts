import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClsService } from 'nestjs-cls';
import { IS_PUBLIC_KEY } from '../../../shared/decorator/public-route.decorator';
import { CaslAbilityFactory } from '../../../shared/access-control';
import { Group, GroupDocument } from '../../group/group.schema';
import { Policy, PolicyDocument } from '../../policy/policy.schema';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    @InjectModel(Group.name)
    private readonly groupModel: Model<GroupDocument>,
    @InjectModel(Policy.name)
    private readonly policyModel: Model<PolicyDocument>,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly clsService: ClsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);
    if (!token) throw new UnauthorizedException();

    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(token);
    } catch {
      throw new UnauthorizedException();
    }

    // Group 정책 로드 (역할 기본 권한)
    const group = await this.groupModel.findOne({ role: payload.role });
    const groupRules = group?.policies ?? [];

    // User 정책 로드 (유저별 세부 정책)
    const userPolicy = await this.policyModel.findOne({
      userId: payload.sub,
      spaceId: payload.spaceId,
    });
    const userRules = userPolicy?.rules ?? [];

    // Ability 생성 + CLS 저장
    const ability = this.caslAbilityFactory.createForUser(
      groupRules,
      userRules,
    );
    this.clsService.set('ability', ability);
    this.clsService.set('userId', payload.sub);

    request.user = {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
      spaceId: payload.spaceId,
    };

    return true;
  }

  private extractToken(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
