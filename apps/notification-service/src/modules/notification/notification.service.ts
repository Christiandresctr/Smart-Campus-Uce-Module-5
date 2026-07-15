import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationService {
  constructor(@InjectModel(Notification.name) private model: Model<Notification>) {}

  async create(dto: CreateNotificationDto) {
    return this.model.create(dto);
  }

  async findAll() {
    return this.model.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    const notif = await this.model.findById(id).exec();
    if (!notif) throw new NotFoundException('Notification not found');
    return notif;
  }

  async update(id: string, dto: UpdateNotificationDto) {
    const notif = await this.model.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!notif) throw new NotFoundException('Notification not found');
    return notif;
  }

  async remove(id: string) {
    const notif = await this.model.findByIdAndDelete(id).exec();
    if (!notif) throw new NotFoundException('Notification not found');
    return notif;
  }
}