import { NestFactory } from '@nestjs/core';
import { MaAdminModule } from './ma-admin.module';

async function bootstrap() {
  const app = await NestFactory.create(MaAdminModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
