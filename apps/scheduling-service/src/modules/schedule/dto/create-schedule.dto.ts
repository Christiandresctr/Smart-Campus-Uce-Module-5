import { IsString, IsInt, Min, Max, IsIn, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateScheduleDto {
  @ApiProperty({ description: 'Student ID' })
  @IsString()
  studentId: string;

  @ApiProperty({ description: 'Company ID' })
  @IsString()
  companyId: string;

  @ApiProperty({ description: 'Start date' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'End date' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ description: 'Day of week (0=Sun, 6=Sat)' })
  @IsInt() @Min(0) @Max(6)
  dayOfWeek: number;

  @ApiProperty({ description: 'Start time (HH:mm)' })
  @IsString()
  startTime: string;

  @ApiProperty({ description: 'End time (HH:mm)' })
  @IsString()
  endTime: string;

  @ApiProperty({ enum: ['active', 'inactive'], default: 'active', required: false })
  @IsOptional() @IsIn(['active', 'inactive'])
  status?: string;
}