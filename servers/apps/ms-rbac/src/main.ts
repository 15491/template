import { NestFactory } from '@nestjs/core';
import { MsRbacModule } from './ms-rbac.module';

async function bootstrap() {
  const app = await NestFactory.create(MsRbacModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
