import { Module } from '@nestjs/common'
import { MaMobileController } from './ma-mobile.controller'
import { MaMobileService } from './ma-mobile.service'

@Module({
  imports: [],
  controllers: [MaMobileController],
  providers: [MaMobileService],
})
export class MaMobileModule {}
