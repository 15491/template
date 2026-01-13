import { Injectable } from '@nestjs/common'

@Injectable()
export class MaAdminService {
  getHello(): string {
    return 'Hello World!'
  }
}
