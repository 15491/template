import { Test, TestingModule } from '@nestjs/testing';
import { MsAuthController } from './ms-auth.controller';
import { MsAuthService } from './ms-auth.service';

describe('MsAuthController', () => {
  let msAuthController: MsAuthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MsAuthController],
      providers: [MsAuthService],
    }).compile();

    msAuthController = app.get<MsAuthController>(MsAuthController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(msAuthController.getHello()).toBe('Hello World!');
    });
  });
});
