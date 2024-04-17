import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import 'dotenv/config';
import { ZodExceptionFilter } from './zod/zod-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  const PORT = process.env.PORT || 3000;
  const BASE_URL = process.env.BASE_URL || 'http://localhost';

  app.useGlobalFilters(new ZodExceptionFilter());

  await app.listen(PORT, () => logger.log(`Приложение запустилось на ${BASE_URL}:${PORT}`));
}
bootstrap();
