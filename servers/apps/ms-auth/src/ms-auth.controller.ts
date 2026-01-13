import { Controller, Get } from '@nestjs/common';
import { MsAuthService } from './ms-auth.service';

@Controller()
export class MsAuthController {
  constructor(private readonly msAuthService: MsAuthService) {}

  @Get()
  getHello(): string {
    return this.msAuthService.getHello();
  }
}
