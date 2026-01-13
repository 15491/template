import { Controller, Get } from '@nestjs/common';
import { MaAdminService } from './ma-admin.service';

@Controller()
export class MaAdminController {
  constructor(private readonly maAdminService: MaAdminService) {}

  @Get()
  getHello(): string {
    return this.maAdminService.getHello();
  }
}
