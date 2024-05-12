import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Coach, type CoachAttributes } from '../../models/coach';
import { type CreateOptions } from 'sequelize';

@Injectable()
export class CoachService {
  constructor(
    @InjectModel(Coach)
    private readonly coachModel: typeof Coach,
  ) {}

  public async createOne(
    userId: string,
    opts?: CreateOptions<CoachAttributes>,
  ) {
    return await this.coachModel.create({ userId }, opts);
  }
}
