import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SharedModule } from './shared/shared.module';
import { AuthGuardModule } from './shared/auth-guard';
import { AuthModule } from './domain/auth/auth.module';
import { SpaceModule } from './domain/space/space.module';
import { CourseModule } from './domain/course/course.module';
import { UnitModule } from './domain/unit/unit.module';
import { SubmissionModule } from './domain/submission/submission.module';
import { PolicyModule } from './domain/policy/policy.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.localhost', '.env'],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('DATABASE_URI'),
      }),
    }),
    SharedModule,
    AuthGuardModule,
    AuthModule,
    SpaceModule,
    CourseModule,
    UnitModule,
    SubmissionModule,
    PolicyModule,
  ],
})
export class AppModule {}
