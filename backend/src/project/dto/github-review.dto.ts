import { IsString, IsNotEmpty } from 'class-validator';

export class GithubReviewDto {
  @IsString()
  @IsNotEmpty()
  repoUrl!: string;
}