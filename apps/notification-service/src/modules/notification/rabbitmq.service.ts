import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqp-connection-manager';
import { ChannelWrapper } from 'amqp-connection-manager';

@Injectable()
export class RabbitmqService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.AmqpConnectionManager;
  private channel: ChannelWrapper;

  async onModuleInit() {
    const uri = process.env.RABBITMQ_URI || 'amqp://guest:guest@rabbitmq:5672';
    this.connection = amqp.connect([uri]);
    this.channel = this.connection.createChannel({
      setup: (channel) =>
        channel.assertExchange('notifications', 'topic', { durable: true }),
    });
  }

  async publishNotification(notification: any) {
    await this.channel.publish(
      'notifications',
      `notification.${notification.userId}`,
      Buffer.from(JSON.stringify(notification)),
    );
  }

  async onModuleDestroy() {
    await this.channel?.close();
    await this.connection?.close();
  }
}