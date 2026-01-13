import { Injectable } from '@nestjs/common';

@Injectable()
export class MaWebService {
  getHello(): string {
    return 'Hello World!';
  }
}
