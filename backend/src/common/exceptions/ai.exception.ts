import { HttpException, HttpStatus } from '@nestjs/common';

export class AiException extends HttpException {
  constructor(message: string) {
    super(
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'AI Processing Error',
        message,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}