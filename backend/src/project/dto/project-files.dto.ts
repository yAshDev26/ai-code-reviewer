import {
  IsArray,
  ValidateNested,
  IsString,
  IsNotEmpty,
  ArrayMinSize,
  ArrayMaxSize,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ProjectFileDto {
  @IsString()
  @IsNotEmpty()
  path!: string;

  @IsString()
  @MaxLength(100000, { message: 'File content must be under 100,000 characters' })
  content!: string;

  @IsString()
  @IsNotEmpty()
  language!: string;
}

export class ProjectFilesReviewDto {
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one file is required' })
  @ArrayMaxSize(10, { message: 'Maximum 10 files can be submitted at once' })
  @ValidateNested({ each: true })
  @Type(() => ProjectFileDto)
  files!: ProjectFileDto[];
}