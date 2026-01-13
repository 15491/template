import { Test, TestingModule } from '@nestjs/testing';
import { MaMobileController } from './ma-mobile.controller';
import { MaMobileService } from './ma-mobile.service';

describe('MaMobileController', () => {
  let maMobileController: MaMobileController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MaMobileController],
      providers: [MaMobileService],
    }).compile();

    maMobileController = app.get<MaMobileController>(MaMobileController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(maMobileController.getHello()).toBe('Hello World!');
    });
  });
});
