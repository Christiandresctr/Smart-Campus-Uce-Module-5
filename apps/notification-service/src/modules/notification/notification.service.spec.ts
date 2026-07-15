import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotificationService } from './notification.service';
import { Notification } from './entities/notification.entity';

const mockNotification = {
  _id: 'abc123',
  userId: '1234567890',
  title: 'Test',
  message: 'Test message',
  type: 'info',
  read: false,
};

describe('NotificationService', () => {
  let service: NotificationService;
  let model: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: getModelToken(Notification.name),
          useValue: {
            create: jest.fn().mockResolvedValue(mockNotification),
            find: jest.fn().mockReturnValue({
              sort: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue([mockNotification]) }),
            }),
            findById: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue(mockNotification),
            }),
            findByIdAndUpdate: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue(mockNotification),
            }),
            findByIdAndDelete: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue(mockNotification),
            }),
          },
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    model = module.get(getModelToken(Notification.name));
  });

  it('should create a notification', async () => {
    const result = await service.create({ userId: '1234567890', title: 'Test', message: 'Test message' });
    expect(result).toEqual(mockNotification);
  });

  it('should find all notifications', async () => {
    const result = await service.findAll();
    expect(result).toEqual([mockNotification]);
  });

  it('should find one notification', async () => {
    const result = await service.findOne('abc123');
    expect(result).toEqual(mockNotification);
  });

  it('should throw on not found', async () => {
    model.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
    await expect(service.findOne('nonexistent')).rejects.toThrow();
  });
});