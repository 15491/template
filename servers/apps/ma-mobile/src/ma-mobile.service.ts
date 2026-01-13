import { Injectable } from '@nestjs/common'

@Injectable()
export class MaMobileService {
  getHello(): string {
    return 'Hello World!'
  }
}
