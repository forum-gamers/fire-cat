import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../../models/user';
import { UserService } from './user.service';
import { UserController } from '../../controllers/user.controller';
import { UserValidation } from './user.validation';
import { CoachService } from '../coach/coach.service';
import { Coach } from '../../models/coach';
import { Mailer } from '../../libs/mailer';

@Module({
  imports: [SequelizeModule.forFeature([User, Coach])],
  providers: [UserService, UserValidation, CoachService, Mailer],
  controllers: [UserController],
})
export class UserModule {}
