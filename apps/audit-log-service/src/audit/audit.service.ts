import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Audit, AuditDocument } from './audit.entity';
import { CreateAuditDto } from './create-audit.dto';

@Injectable()
export class AuditService {
  constructor(@InjectModel(Audit.name) private auditModel: Model<AuditDocument>) {}

  findAll(): Promise<AuditDocument[]> {
    return this.auditModel.find().exec();
  }

  findOne(id: string): Promise<AuditDocument | null> {
    return this.auditModel.findById(id).exec();
  }

  create(dto: CreateAuditDto): Promise<AuditDocument> {
    return this.auditModel.create(dto);
  }

  async remove(id: string): Promise<void> {
    await this.auditModel.findByIdAndDelete(id).exec();
  }
}