import { NestFactory } from '@nestjs/core';
import { MaMobileModule } from './ma-mobile.module';

async function bootstrap() {
  const app = await NestFactory.create(MaMobileModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
