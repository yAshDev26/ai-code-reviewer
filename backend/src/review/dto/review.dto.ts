import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class ReviewDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50000, { message: 'Code must be under 50,000 characters' })
  code!: string;

  @IsString()
  @IsNotEmpty()
  language!: string;
}