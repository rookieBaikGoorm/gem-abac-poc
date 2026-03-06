import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClsService } from 'nestjs-cls';
import { Group, GroupDocument } from '../../group/group.schema';
import { Policy, PolicyDocument } from '../../policy/policy.schema';
import { CaslAbilityFactory } from '../../../shared/access-control';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    @InjectModel(Group.name)
    private readonly groupModel: Model<GroupDocument>,
    @InjectModel(Policy.name)
    private readonly policyModel: Model<PolicyDocument>,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly clsService: ClsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    // 1. Group 정책 로드 (역할 기본 권한)
    const group = await this.groupModel.findOne({ role: payload.role });
    const groupRules = group?.policies ?? [];

    // 2. User 정책 로드 (유저별 세부 정책)
    const userPolicy = await this.policyModel.findOne({
      userId: payload.sub,
      spaceId: payload.spaceId,
    });
    const userRules = userPolicy?.rules ?? [];

    // 3. Ability 생성 + CLS 저장
    const ability = this.caslAbilityFactory.createForUser(
      groupRules,
      userRules,
    );
    this.clsService.set('ability', ability);
    this.clsService.set('userId', payload.sub);

    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
      spaceId: payload.spaceId,
    };
  }
}
