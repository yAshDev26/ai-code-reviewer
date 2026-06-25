import { Controller, Post, Body } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ProjectReviewService } from './services/project-review.service';
import { ProjectFilesReviewDto } from './dto/project-files.dto';
import { GithubReviewDto } from './dto/github-review.dto';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectReviewService: ProjectReviewService) {}

  // Project review hits up to 6 Groq calls (5 files + cross-file) — tight limit
  @Post('review-files')
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  async reviewFiles(@Body() dto: ProjectFilesReviewDto) {
    return this.projectReviewService.reviewFiles(dto.files);
  }

  // GitHub review also hits up to 6 Groq calls — same tight limit
  @Post('review-github')
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  async reviewGithub(@Body() dto: GithubReviewDto) {
    return this.projectReviewService.reviewGithubRepo(dto.repoUrl);
  }
}