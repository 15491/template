import { Test, TestingModule } from '@nestjs/testing';
import { MaWebController } from './ma-web.controller';
import { MaWebService } from './ma-web.service';

describe('MaWebController', () => {
  let maWebController: MaWebController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MaWebController],
      providers: [MaWebService],
    }).compile();

    maWebController = app.get<MaWebController>(MaWebController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(maWebController.getHello()).toBe('Hello World!');
    });
  });
});
