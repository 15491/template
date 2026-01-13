import { Injectable } from '@nestjs/common';

@Injectable()
export class MsAuthService {
  getHello(): string {
    return 'Hello World!';
  }
}
