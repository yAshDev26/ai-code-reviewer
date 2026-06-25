import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AiService } from './services/ai.service';
import { AllExceptionsFilter } from './filters/http-exception.filter';

@Module({
  providers: [
    AiService,
    // Register globally via DI so it has access to NestJS services
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
  exports: [AiService],
})
export class CommonModule {}