import { IsString, IsNumber, IsOptional, IsDateString, Min } from 'class-validator';

export class CreateHourLogDto {
  @IsDateString()
  log_date: string;

  @IsNumber()
  @Min(0.5)
  hours: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  location_lat?: number;

  @IsOptional()
  @IsNumber()
  location_lng?: number;
}
