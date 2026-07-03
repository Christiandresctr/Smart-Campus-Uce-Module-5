import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Approval } from './approval.entity';
import { CreateApprovalDto, ApproveRejectDto } from './create-approval.dto';

@Injectable()
export class ApprovalService {
  constructor(
    @InjectRepository(Approval)
    private repo: Repository<Approval>,
  ) {}

  async create(dto: CreateApprovalDto) {
    const approval = this.repo.create({
      internship_id: dto.internship_id,
      current_step: 'tutor',
      status: 'pending',
    });
    return this.repo.save(approval);
  }

  async findAll() {
    return this.repo.find();
  }

  async findOne(id: string) {
    const approval = await this.repo.findOne({ where: { id } });
    if (!approval) throw new NotFoundException('Approval not found');
    return approval;
  }

  async findByInternship(internshipId: string) {
    return this.repo.find({ where: { internship_id: internshipId } });
  }

  async approve(id: string, dto: ApproveRejectDto) {
    const approval = await this.findOne(id);
    const steps = ['tutor', 'coordinator', 'dean'];
    const currentIndex = steps.indexOf(approval.current_step);
    approval.signatures = {
      ...approval.signatures,
      [approval.current_step]: { signed_at: new Date().toISOString(), comment: dto.comment },
    };
    if (currentIndex >= steps.length - 1) {
      approval.status = 'approved';
      approval.current_step = 'completed';
    } else {
      approval.current_step = steps[currentIndex + 1];
    }
    return this.repo.save(approval);
  }

  async reject(id: string, dto: ApproveRejectDto) {
    const approval = await this.findOne(id);
    approval.status = 'rejected';
    approval.signatures = {
      ...approval.signatures,
      [approval.current_step]: { signed_at: new Date().toISOString(), comment: dto.comment },
    };
    return this.repo.save(approval);
  }
}