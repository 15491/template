import { Injectable } from '@nestjs/common'

@Injectable()
export class MsUserService {
  getHello(): string {
    return 'Hello World!'
  }
}
