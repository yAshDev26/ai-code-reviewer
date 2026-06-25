import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class ExecuteDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50000, { message: 'Code must be under 50,000 characters' })
  code!: string;

  @IsString()
  @IsNotEmpty()
  language!: string;

  @IsString()
  @IsOptional()
  stdin!: string;
}