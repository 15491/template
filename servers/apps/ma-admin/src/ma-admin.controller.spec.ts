import { Test, TestingModule } from '@nestjs/testing';
import { MaAdminController } from './ma-admin.controller';
import { MaAdminService } from './ma-admin.service';

describe('MaAdminController', () => {
  let maAdminController: MaAdminController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MaAdminController],
      providers: [MaAdminService],
    }).compile();

    maAdminController = app.get<MaAdminController>(MaAdminController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(maAdminController.getHello()).toBe('Hello World!');
    });
  });
});
