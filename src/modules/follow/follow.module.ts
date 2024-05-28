import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowValidation } from './follow.validation';
import { SequelizeModule } from '@nestjs/sequelize';
import { Follow } from '../../models/follow';
import { User } from '../../models/user';
import { FollowController } from '../../controllers/follow.controller';

@Module({
  imports: [SequelizeModule.forFeature([Follow, User])],
  providers: [FollowService, FollowValidation],
  controllers: [FollowController],
})
export class FollowModule {}
