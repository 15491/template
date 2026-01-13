import { Module } from '@nestjs/common'
import { ResponseModule } from './response/response.module'
import { SharedService } from './shared.service'

@Module({
  providers: [SharedService],
  exports: [SharedService],
  imports: [ResponseModule],
})
export class SharedModule {}
