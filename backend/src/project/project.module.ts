import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectReviewService } from './services/project-review.service';
import { GithubFetcherService } from './services/github-fetcher.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [ProjectController],
  providers: [ProjectReviewService, GithubFetcherService],
})
export class ProjectModule {}