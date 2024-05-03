import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Coach } from '../../models/coach';
import { CoachService } from './coach.service';

@Module({
  imports: [SequelizeModule.forFeature([Coach])],
  providers: [CoachService],
})
export class CoachModule {}
