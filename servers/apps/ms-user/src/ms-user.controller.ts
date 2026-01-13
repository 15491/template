import { Controller, Get } from '@nestjs/common'
import { MsUserService } from './ms-user.service'

@Controller()
export class MsUserController {
  constructor(private readonly msUserService: MsUserService) {}

  @Get()
  getHello(): string {
    return this.msUserService.getHello()
  }
}
