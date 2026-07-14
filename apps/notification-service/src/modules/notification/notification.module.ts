import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { Notification, NotificationSchema } from './entities/notification.entity';
import { NotificationGateway } from './notification.gateway';
import { RabbitmqService } from './rabbitmq.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationGateway, RabbitmqService],
  exports: [RabbitmqService, NotificationGateway],
})
export class NotificationModule {}