import { Module } from '@nestjs/common'
import { ResponseService } from './response.service.js'

@Module({
  providers: [ResponseService],
  exports: [ResponseService],
})
export class ResponseModule {}
