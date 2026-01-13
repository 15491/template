import { NestFactory } from '@nestjs/core';
import { MaWebModule } from './ma-web.module';

async function bootstrap() {
  const app = await NestFactory.create(MaWebModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
