import { Test, TestingModule } from '@nestjs/testing';
import { MsUserController } from './ms-user.controller';
import { MsUserService } from './ms-user.service';

describe('MsUserController', () => {
  let msUserController: MsUserController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MsUserController],
      providers: [MsUserService],
    }).compile();

    msUserController = app.get<MsUserController>(MsUserController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(msUserController.getHello()).toBe('Hello World!');
    });
  });
});
