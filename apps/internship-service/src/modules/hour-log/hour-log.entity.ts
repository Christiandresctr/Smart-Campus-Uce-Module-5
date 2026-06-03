import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { Internship } from '../internship/internship.entity';

@Entity()
export class HourLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  internship_id: string;

  @Column({ type: 'date' })
  log_date: string;

  @Column({ type: 'decimal', precision: 4, scale: 2 })
  hours: number;

  @Column('text', { nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  location_lat: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  location_lng: number;

  @Column({ default: false })
  approved: boolean;

  @ManyToOne(() => Internship, (internship) => internship.hourLogs)
  @JoinColumn({ name: 'internship_id' })
  internship: Internship;
}
