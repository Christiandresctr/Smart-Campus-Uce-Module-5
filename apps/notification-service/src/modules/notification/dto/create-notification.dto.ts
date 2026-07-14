import { IsString, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({ description: 'ID del usuario destino', example: '1234567890' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'Título de la notificación', example: 'Nueva tarea asignada' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Cuerpo del mensaje', example: 'Se te ha asignado una nueva práctica' })
  @IsString()
  message: string;

  @ApiProperty({ description: 'Tipo de notificación', enum: ['info', 'warning', 'error', 'success'], default: 'info', required: false })
  @IsOptional()
  @IsIn(['info', 'warning', 'error', 'success'])
  type?: string;
}