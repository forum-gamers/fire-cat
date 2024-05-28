import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Follow, type FollowAttributes } from '../../models/follow';
import type { CreateOptions } from 'sequelize';
import type { Pagination } from './follow.interface';

@Injectable()
export class FollowService {
  constructor(
    @InjectModel(Follow)
    private readonly followModel: typeof Follow,
  ) {}

  public async findOneByFollow(followingId: string, followerId: string) {
    return await this.followModel.findOne({
      where: { followingId, followerId },
    });
  }

  public async createOne(
    followingId: string,
    followerId: string,
    opts?: CreateOptions<FollowAttributes>,
  ) {
    return await this.followModel.create({ followingId, followerId }, opts);
  }

  public async myFollow(id: string, { page = 1, limit = 10 }: Pagination) {
    return await this.followModel.findAll({
      where: { followerId: id },
      offset: (page - 1) * limit,
      limit,
    });
  }

  public async myFollower(id: string, { page = 1, limit = 10 }: Pagination) {
    return await this.followModel.findAll({
      where: { followingId: id },
      offset: (page - 1) * limit,
      limit,
    });
  }
}
