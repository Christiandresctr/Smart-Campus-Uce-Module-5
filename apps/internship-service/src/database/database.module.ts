import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Internship } from '../modules/internship/internship.entity';
import { HourLog } from '../modules/hour-log/hour-log.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'user',
      password: process.env.DB_PASSWORD || 'pass',
      database: process.env.DB_NAME || 'internship_db',
      entities: [Internship, HourLog],
      synchronize: true,
    }),
  ],
})
export class DatabaseModule {}
