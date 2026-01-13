import { Module } from '@nestjs/common';
import { MaWebController } from './ma-web.controller';
import { MaWebService } from './ma-web.service';

@Module({
  imports: [],
  controllers: [MaWebController],
  providers: [MaWebService],
})
export class MaWebModule {}
