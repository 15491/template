import { Module } from '@nestjs/common';
import { MsAuthController } from './ms-auth.controller';
import { MsAuthService } from './ms-auth.service';

@Module({
  imports: [],
  controllers: [MsAuthController],
  providers: [MsAuthService],
})
export class MsAuthModule {}
