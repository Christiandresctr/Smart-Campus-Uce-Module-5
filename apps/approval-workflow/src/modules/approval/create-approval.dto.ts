import { IsUUID, IsOptional, IsString } from 'class-validator';

export class CreateApprovalDto {
  @IsUUID()
  internship_id: string;
}

export class ApproveRejectDto {
  @IsString()
  comment: string;

  @IsOptional()
  @IsString()
  digital_signature?: string;
}