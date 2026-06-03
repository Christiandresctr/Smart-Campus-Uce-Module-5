import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, OneToMany,
} from 'typeorm';
import { HourLog } from '../hour-log/hour-log.entity';

export enum InternshipStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
}

@Entity()
export class Internship {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  student_id: string;

  @Column({ length: 200 })
  company_name: string;

  @Column('text', { nullable: true })
  company_address: string;

  @Column({ type: 'date' })
  start_date: string;

  @Column({ type: 'date' })
  end_date: string;

  @Column({ default: 320 })
  total_hours_required: number;

  @Column({ default: 0 })
  total_hours_completed: number;

  @Column({
    type: 'varchar',
    length: 50,
    default: InternshipStatus.DRAFT,
  })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => HourLog, (hourLog) => hourLog.internship)
  hourLogs: HourLog[];
}