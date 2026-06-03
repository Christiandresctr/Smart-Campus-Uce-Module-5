import {
  Controller, Get, Post, Put, Delete,
  Body, Param, ParseUUIDPipe,
} from '@nestjs/common';
import { InternshipService } from './internship.service';
import { CreateInternshipDto } from './create-internship.dto';
import { Internship } from './internship.entity';

@Controller('api/v1/internship')
export class InternshipController {
  constructor(private service: InternshipService) {}

  @Post()
  create(@Body() dto: CreateInternshipDto): Promise<Internship> {
    return this.service.create(dto);
  }

  @Get()
  findAll(): Promise<Internship[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Internship> {
    return this.service.findOne(id);
  }

  @Get('student/:studentId')
  findByStudent(@Param('studentId') studentId: string): Promise<Internship[]> {
    return this.service.findByStudent(studentId);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateInternshipDto,
  ): Promise<Internship> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.service.remove(id);
  }
}