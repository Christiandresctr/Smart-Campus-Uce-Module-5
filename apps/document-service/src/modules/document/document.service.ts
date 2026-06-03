import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Document } from './document.schema';
import { CreateDocumentDto } from './create-document.dto';

@Injectable()
export class DocumentService {
  constructor(
    @InjectModel(Document.name) private model: Model<Document>,
  ) {}

  async create(dto: CreateDocumentDto, file: Express.Multer.File): Promise<Document> {
    const crypto = await import('crypto');
    const file_hash = crypto.createHash('sha256').update(file.buffer).digest('hex');

    const doc = await this.model.create({
      ...dto,
      file_name: file.originalname,
      file_size: file.size,
      file_hash,
      file_url: `/api/v1/document/${file.filename || 'pending'}`,
    });

    return doc;
  }

  async findAll(): Promise<Document[]> {
    return this.model.find().exec();
  }

  async findOne(id: string): Promise<Document> {
    const doc = await this.model.findById(id).exec();
    if (!doc) throw new NotFoundException('Document not found');
    return doc;
  }

  async findByInternship(internshipId: string): Promise<Document[]> {
    return this.model.find({ internship_id: internshipId }).exec();
  }

  async remove(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id).exec();
  }
}