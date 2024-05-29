import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowValidation } from './follow.validation';
import { SequelizeModule } from '@nestjs/sequelize';
import { Follow } from '../../models/follow';
import { User } from '../../models/user';
import { FollowController } from '../../controllers/follow.controller';
import { UserService } from '../user/user.service';

@Module({
  imports: [SequelizeModule.forFeature([Follow, User])],
  providers: [FollowService, FollowValidation, UserService],
  controllers: [FollowController],
})
export class FollowModule {}
