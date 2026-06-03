import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { DocumentModule } from './modules/document/document.module';

@Module({
  imports: [DatabaseModule, DocumentModule],
})
export class AppModule {}