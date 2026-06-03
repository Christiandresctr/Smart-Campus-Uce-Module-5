import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InternshipController } from './internship.controller';
import { InternshipService } from './internship.service';
import { Internship } from './internship.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Internship])],
  controllers: [InternshipController],
  providers: [InternshipService],
})
export class InternshipModule {}