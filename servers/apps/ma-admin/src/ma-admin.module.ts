import { Module } from '@nestjs/common';
import { MaAdminController } from './ma-admin.controller';
import { MaAdminService } from './ma-admin.service';

@Module({
  imports: [],
  controllers: [MaAdminController],
  providers: [MaAdminService],
})
export class MaAdminModule {}
