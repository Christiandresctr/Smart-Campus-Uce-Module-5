import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Approval {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  internship_id: string;

  @Column({ default: 'tutor' })
  current_step: string; // tutor → coordinator → dean

  @Column({ default: 'pending' })
  status: string; // pending, approved, rejected

  @Column('jsonb', { nullable: true })
  signatures: Record<string, { signed_at: string; comment: string }>;

  @Column('jsonb', { nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}