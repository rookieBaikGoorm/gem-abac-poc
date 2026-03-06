import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AccessControlModule } from './access-control/access-control.module';
import { EventsService } from './events/events.service';

@Module({
  imports: [EventEmitterModule.forRoot(), AccessControlModule],
  providers: [EventsService],
  exports: [AccessControlModule, EventsService],
})
export class SharedModule {}
