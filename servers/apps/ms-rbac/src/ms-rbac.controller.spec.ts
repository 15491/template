import { Test, TestingModule } from '@nestjs/testing';
import { MsRbacController } from './ms-rbac.controller';
import { MsRbacService } from './ms-rbac.service';

describe('MsRbacController', () => {
  let msRbacController: MsRbacController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MsRbacController],
      providers: [MsRbacService],
    }).compile();

    msRbacController = app.get<MsRbacController>(MsRbacController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(msRbacController.getHello()).toBe('Hello World!');
    });
  });
});
