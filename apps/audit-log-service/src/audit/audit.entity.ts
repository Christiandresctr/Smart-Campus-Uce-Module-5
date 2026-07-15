import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AuditDocument = Audit & Document;

@Schema({ timestamps: true })
export class Audit {
  @Prop({ required: true })
  action: string;

  @Prop({ required: true })
  entity: string;

  @Prop({ required: true })
  entityId: string;

  @Prop()
  userId: string;

  @Prop({ type: Object })
  details: Record<string, any>;
}

export const AuditSchema = SchemaFactory.createForClass(Audit);