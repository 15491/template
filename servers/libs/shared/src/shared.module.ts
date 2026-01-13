import { Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { ResponseModule } from './response/response.module';

@Module({
  providers: [SharedService],
  exports: [SharedService],
  imports: [ResponseModule],
})
export class SharedModule {}
