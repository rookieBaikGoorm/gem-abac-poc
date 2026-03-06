import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Group, GroupSchema } from '../../domain/group/group.schema';
import { Policy, PolicySchema } from '../../domain/policy/policy.schema';
import { AccessControlModule } from '../access-control';
import { JwtAuthGuard } from '../../domain/auth/guards/jwt-auth.guard';
import { AccessControlGuard } from '../access-control/guard/access-control.guard';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
    MongooseModule.forFeature([
      { name: Group.name, schema: GroupSchema },
      { name: Policy.name, schema: PolicySchema },
    ]),
    AccessControlModule,
  ],
  providers: [
    JwtAuthGuard,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: AccessControlGuard },
  ],
  exports: [JwtModule],
})
export class AuthGuardModule {}
