import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class CreateAuditDto {
  @IsString()
  @IsNotEmpty()
  action: string;

  @IsString()
  @IsNotEmpty()
  entity: string;

  @IsString()
  @IsNotEmpty()
  entityId: string;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsObject()
  @IsOptional()
  details?: Record<string, any>;
}