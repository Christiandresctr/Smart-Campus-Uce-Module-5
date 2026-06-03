import {
  Controller, Get, Post, Delete,
  Body, Param, UseInterceptors, UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './create-document.dto';
import { Document } from './document.schema';

@Controller('api/v1/document')
export class DocumentController {
  constructor(private service: DocumentService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        internship_id: { type: 'string' },
        document_type: { type: 'string' },
        uploaded_by: { type: 'string' },
      },
    },
  })
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateDocumentDto,
  ): Promise<Document> {
    return this.service.create(dto, file);
  }

  @Get()
  findAll(): Promise<Document[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Document> {
    return this.service.findOne(id);
  }

  @Get('internship/:internshipId')
  findByInternship(@Param('internshipId') internshipId: string): Promise<Document[]> {
    return this.service.findByInternship(internshipId);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }
}