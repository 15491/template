import { Injectable } from '@nestjs/common'

@Injectable()
export class MsRbacService {
  getHello(): string {
    return 'Hello World!'
  }
}
