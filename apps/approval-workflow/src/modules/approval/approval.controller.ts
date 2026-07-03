import { Controller, Get, Post, Put, Param, Body, ParseUUIDPipe } from '@nestjs/common';
import { ApprovalService } from './approval.service';
import { CreateApprovalDto, ApproveRejectDto } from './create-approval.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Approval')
@Controller('api/v1/approval')
export class ApprovalController {
  constructor(private service: ApprovalService) {}

  @Post('start')
  create(@Body() dto: CreateApprovalDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Get('status/:internshipId')
  findByInternship(@Param('internshipId', ParseUUIDPipe) internshipId: string) {
    return this.service.findByInternship(internshipId);
  }

  @Put(':id/approve')
  approve(@Param('id', ParseUUIDPipe) id: string, @Body() dto: ApproveRejectDto) {
    return this.service.approve(id, dto);
  }

  @Put(':id/reject')
  reject(@Param('id', ParseUUIDPipe) id: string, @Body() dto: ApproveRejectDto) {
    return this.service.reject(id, dto);
  }
}