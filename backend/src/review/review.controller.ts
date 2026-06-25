import { Controller, Post, Body } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ReviewService } from './review.service';
import { ReviewDto } from './dto/review.dto';
import { AutoFixDto } from './dto/autofix.dto';
import { ReviewResponse, AutoFixResponse } from './interfaces/review.interfaces';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  // Review hits 5 Groq API calls — tighter limit: 10 per minute
  @Post()
  @Throttle({ default: { ttl: 60000, limit: 10 } })
  async reviewCode(@Body() dto: ReviewDto): Promise<ReviewResponse> {
    return this.reviewService.reviewCode(dto);
  }

  // AutoFix hits 1 Groq API call — standard limit
  @Post('autofix')
  @Throttle({ default: { ttl: 60000, limit: 20 } })
  async autoFix(@Body() dto: AutoFixDto): Promise<AutoFixResponse> {
    return this.reviewService.autoFix(dto);
  }
}