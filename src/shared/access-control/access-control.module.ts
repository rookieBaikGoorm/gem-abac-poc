import { Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { CaslAbilityFactory } from './factory';
import { AccessControlGuard } from './guard';
import { AccessControlService } from './service';

@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),
  ],
  providers: [CaslAbilityFactory, AccessControlGuard, AccessControlService],
  exports: [CaslAbilityFactory, AccessControlGuard, AccessControlService],
})
export class AccessControlModule {}
