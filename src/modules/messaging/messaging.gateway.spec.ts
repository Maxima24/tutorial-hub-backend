import { Test, TestingModule } from '@nestjs/testing';
import { MessagingGateway } from './messaging.gateway';

describe('MessagingController', () => {
  let controller: MessagingGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessagingGateway],
    }).compile();

    controller = module.get<MessagingGateway>(MessagingGateway);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
