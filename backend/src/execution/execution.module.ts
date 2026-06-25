import { Module } from '@nestjs/common';
import { ExecutionController } from './execution.controller';
import { E2BService } from './services/e2b.service';
import { CommonModule } from '../common/common.module';
import { ReviewModule } from '../review/review.module';

@Module({
  imports: [CommonModule, ReviewModule],
  controllers: [ExecutionController],
  providers: [E2BService],
})
export class ExecutionModule {}