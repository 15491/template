import { Controller, Get } from '@nestjs/common'
import { MsRbacService } from './ms-rbac.service'

@Controller()
export class MsRbacController {
  constructor(private readonly msRbacService: MsRbacService) {}

  @Get()
  getHello(): string {
    return this.msRbacService.getHello()
  }
}
