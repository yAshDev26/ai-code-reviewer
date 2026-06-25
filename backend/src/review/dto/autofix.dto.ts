import { IsString, IsNotEmpty, IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { ReviewIssueDto } from './review-issue.dto';

export class AutoFixDto {
  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsString()
  @IsNotEmpty()
  language!: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'At least one issue is required for auto fix' })
  @ValidateNested({ each: true })
  @Type(() => ReviewIssueDto)
  issues!: ReviewIssueDto[];
}