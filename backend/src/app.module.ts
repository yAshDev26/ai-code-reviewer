import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ReviewModule } from './review/review.module';
import { CommonModule } from './common/common.module';
import { ProjectModule } from './project/project.module';
import { ExecutionModule } from './execution/execution.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // Rate limiting — 20 requests per 60 seconds per IP
    ThrottlerModule.forRoot([
      {
        name:  'default',
        ttl:   60000, // 1 minute window
        limit: 20,    // max 20 requests per window
      },
    ]),

    CommonModule,
    ReviewModule,
    ProjectModule,
    ExecutionModule,
  ],
  providers: [
    // Apply rate limiting globally to all routes
    {
      provide:  APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}