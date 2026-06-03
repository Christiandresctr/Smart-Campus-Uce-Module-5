import { IsString, IsOptional } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  internship_id: string;

  @IsString()
  document_type: string;

  @IsString()
  uploaded_by: string;

  @IsOptional()
  @IsString()
  correction_of?: string;
}