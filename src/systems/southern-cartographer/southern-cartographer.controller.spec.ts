import { Test, TestingModule } from '@nestjs/testing';
import { SouthernCartographerController } from './southern-cartographer.controller';

describe('SouthernCartographerController', () => {
  let controller: SouthernCartographerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SouthernCartographerController],
    }).compile();

    controller = module.get<SouthernCartographerController>(SouthernCartographerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
