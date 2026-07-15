import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { CreateAuditDto } from './create-audit.dto';

@ApiTags('Auditoría')
@Controller('api/v1/audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @ApiOperation({ summary: 'Listar todos los registros de auditoría' })
  @Get()
  findAll() {
    return this.auditService.findAll();
  }

  @ApiOperation({ summary: 'Obtener registro de auditoría por ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.auditService.findOne(id);
  }

  @ApiOperation({ summary: 'Crear registro de auditoría' })
  @Post()
  create(@Body() dto: CreateAuditDto) {
    return this.auditService.create(dto);
  }

  @ApiOperation({ summary: 'Eliminar registro de auditoría' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.auditService.remove(id);
  }
}