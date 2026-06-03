import { IsString, IsOptional, IsDateString, IsNumber, Min } from 'class-validator';

export class CreateInternshipDto {
  @IsString()
  student_id: string;

  @IsString()
  company_name: string;

  @IsOptional()
  @IsString()
  company_address?: string;

  @IsDateString()
  start_date: string;

  @IsDateString()
  end_date: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  total_hours_required?: number;
}