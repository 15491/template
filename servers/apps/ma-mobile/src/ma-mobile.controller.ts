import { Controller, Get } from '@nestjs/common'
import { MaMobileService } from './ma-mobile.service'

@Controller()
export class MaMobileController {
  constructor(private readonly maMobileService: MaMobileService) {}

  @Get()
  getHello(): string {
    return this.maMobileService.getHello()
  }
}
