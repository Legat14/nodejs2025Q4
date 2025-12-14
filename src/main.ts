import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/filters.all-exceptions';
import { LoggingService } from './logging/logging.service';
import { AuthGuard } from './auth/guards/auth.guard';

async function bootstrap() {
  const PORT = process.env.PORT || 4000;
  const app = await NestFactory.create(AppModule);
  const logger = app.get(LoggingService);
  app.useGlobalFilters(new AllExceptionsFilter(logger));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalGuards(app.get(AuthGuard));

  process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception', error.stack);
  });

  process.on('unhandledRejection', (reason: any) => {
    logger.error('Unhandled rejection', reason?.stack ?? reason);
  });

  await app.listen(PORT);
  console.log(`The app is running on port: \x1b[36;1m${PORT}\x1b[0m`);
}

bootstrap();
