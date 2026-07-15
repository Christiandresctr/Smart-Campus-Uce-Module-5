import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './company.entity';
import { CreateCompanyDto } from './create-company.dto';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  findAll(): Promise<Company[]> {
    return this.companyRepository.find();
  }

  async findOne(id: number): Promise<Company> {
    const company = await this.companyRepository.findOneBy({ id });
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  create(dto: CreateCompanyDto): Promise<Company> {
    const company = this.companyRepository.create(dto);
    return this.companyRepository.save(company);
  }

  async update(id: number, dto: Partial<CreateCompanyDto>): Promise<Company> {
    const company = await this.companyRepository.findOneBy({ id });
    if (!company) throw new NotFoundException('Company not found');
    await this.companyRepository.update(id, dto);
    return this.companyRepository.findOneByOrFail({ id });
  }

  async remove(id: number): Promise<void> {
    await this.companyRepository.delete(id);
  }
}