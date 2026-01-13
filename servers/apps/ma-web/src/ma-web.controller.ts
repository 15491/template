import { Controller, Get } from '@nestjs/common'
import { MaWebService } from './ma-web.service'

@Controller()
export class MaWebController {
  constructor(private readonly maWebService: MaWebService) {}

  @Get()
  getHello(): string {
    return this.maWebService.getHello()
  }
}
