import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './create-company.dto';

@ApiTags('Empresas')
@Controller('api/v1/company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @ApiOperation({ summary: 'Listar todas las empresas' })
  @Get()
  findAll() {
    return this.companyService.findAll();
  }

  @ApiOperation({ summary: 'Obtener empresa por ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(+id);
  }

  @ApiOperation({ summary: 'Crear nueva empresa' })
  @Post()
  create(@Body() dto: CreateCompanyDto) {
    return this.companyService.create(dto);
  }

  @ApiOperation({ summary: 'Actualizar empresa' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateCompanyDto>) {
    return this.companyService.update(+id, dto);
  }

  @ApiOperation({ summary: 'Eliminar empresa' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(+id);
  }
}