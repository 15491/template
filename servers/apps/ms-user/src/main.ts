import { NestFactory } from '@nestjs/core'
import { MsUserModule } from './ms-user.module'

async function bootstrap() {
  const app = await NestFactory.create(MsUserModule)
  await app.listen(process.env.port ?? 3000)
}
void bootstrap()
