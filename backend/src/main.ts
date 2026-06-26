import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import * as express from 'express';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // ── Payload size limit ───────────────────────────────────────────────────
  // Prevents oversized submissions from consuming multiple Groq API calls.
  // 100kb covers even the largest realistic code files comfortably.
  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ limit: '100kb', extended: true }));

  // ── CORS ─────────────────────────────────────────────────────────────────
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://yashdev-code-reviewer.vercel.app',
      'https://ai-code-reviewer-teal-tau.vercel.app',
      /\.vercel\.app$/,
      process.env.FRONTEND_URL || '',
    ].filter(Boolean),
    methods: ['GET', 'POST'],
  });

  // ── Global validation pipe ───────────────────────────────────────────────
  // whitelist:   strips unknown properties from request bodies
  // transform:   auto-converts plain objects to DTO class instances
  // forbidNonWhitelisted: false — silently strip rather than reject
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist:            true,
      forbidNonWhitelisted: false,
      transform:            true,
    }),
  );

  // AllExceptionsFilter is registered via APP_FILTER in CommonModule
  // ThrottlerGuard is registered via APP_GUARD in AppModule

  const port = process.env.PORT || 3001;
  await app.listen(port);
  logger.log(`Backend running on http://localhost:${port}`);
  logger.log(`Rate limit: 20 requests / 60s per IP`);
  logger.log(`Payload limit: 100kb`);
}

bootstrap();