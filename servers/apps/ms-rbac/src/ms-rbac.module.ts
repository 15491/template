import { Module } from '@nestjs/common'
import { MsRbacController } from './ms-rbac.controller'
import { MsRbacService } from './ms-rbac.service'

@Module({
  imports: [],
  controllers: [MsRbacController],
  providers: [MsRbacService],
})
export class MsRbacModule {}
