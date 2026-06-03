import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Internship } from './internship.entity';
import { CreateInternshipDto } from './create-internship.dto';

@Injectable()
export class InternshipService {
  constructor(
    @InjectRepository(Internship)
    private repo: Repository<Internship>,
  ) {}

  async create(dto: CreateInternshipDto): Promise<Internship> {
    const internship = this.repo.create(dto);
    return this.repo.save(internship);
  }

  async findAll(): Promise<Internship[]> {
    return this.repo.find();
  }

  async findOne(id: string): Promise<Internship> {
    const internship = await this.repo.findOne({ where: { id } });
    if (!internship) throw new NotFoundException('Internship not found');
    return internship;
  }

  async findByStudent(studentId: string): Promise<Internship[]> {
    return this.repo.find({ where: { student_id: studentId } });
  }

  async update(id: string, dto: Partial<CreateInternshipDto>): Promise<Internship> {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}