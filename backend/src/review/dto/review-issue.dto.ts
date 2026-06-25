import {
  IsString,
  IsNotEmpty,
  IsIn,
  IsNumber,
  IsOptional,
  ValidateIf,
} from 'class-validator';

export class ReviewIssueDto {
  @IsString()
  @IsIn(['critical', 'warning', 'suggestion'])
  severity!: 'critical' | 'warning' | 'suggestion';

  @ValidateIf((o) => o.line !== null)
  @IsNumber()
  @IsOptional()
  line!: number | null;

  @IsString()
  @IsNotEmpty()
  issue!: string;

  @IsString()
  @IsNotEmpty()
  explanation!: string;

  @IsString()
  fix!: string;

  @IsString()
  @IsOptional()
  @IsIn(['security', 'performance', 'best-practices', 'code-style', 'runtime'])
  category!: string;
}