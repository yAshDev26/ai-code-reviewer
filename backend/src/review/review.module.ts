import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { CommonModule } from '../common/common.module';
import { AgentOrchestratorService } from './agents/agent-orchestrator.service';

@Module({
  imports: [CommonModule],
  controllers: [ReviewController],
  providers: [ReviewService, AgentOrchestratorService],
  exports: [ReviewService],
})
export class ReviewModule {}