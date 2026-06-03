import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document as MongoDocument, Types } from 'mongoose';

export type DocumentDocument = Document & MongoDocument;

@Schema({ timestamps: true })
export class Document {
  @Prop({ required: true })
  internship_id: string;

  @Prop({ required: true, enum: ['aval_academico', 'carta_aceptacion', 'informe', 'certificado'] })
  document_type: string;

  @Prop({ required: true })
  file_name: string;

  @Prop({ required: true })
  file_url: string;

  @Prop({ required: true })
  file_size: number;

  @Prop({ required: true })
  file_hash: string;

  @Prop({ default: 1 })
  version: number;

  @Prop({ required: true })
  uploaded_by: string;

  @Prop({ type: Types.ObjectId, ref: 'Document', default: null })
  correction_of: Types.ObjectId;
}

export const DocumentSchema = SchemaFactory.createForClass(Document);