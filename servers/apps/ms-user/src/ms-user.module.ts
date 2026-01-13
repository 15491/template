import { Module } from '@nestjs/common';
import { MsUserController } from './ms-user.controller';
import { MsUserService } from './ms-user.service';

@Module({
  imports: [],
  controllers: [MsUserController],
  providers: [MsUserService],
})
export class MsUserModule {}
