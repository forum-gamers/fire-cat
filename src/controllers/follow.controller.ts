import { Controller, UseInterceptors } from '@nestjs/common';
import { AuthenticationInterceptor } from '../middlewares/authentication.middleware';
import { BaseController } from '../base/controller.base';
import { FollowService } from '../modules/follow/follow.service';
import { FollowValidation } from '../modules/follow/follow.validation';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { FOLLOWSERVICE } from '../constants/follow.constant';
import { FollowServiceMethod } from '../enum/follow.enum';
import type { Metadata } from '@grpc/grpc-js';
import { Status } from '@grpc/grpc-js/build/src/constants';

@Controller()
@UseInterceptors(AuthenticationInterceptor)
export class FollowController extends BaseController {
  constructor(
    private readonly followService: FollowService,
    private readonly followValidation: FollowValidation,
  ) {
    super();
  }

  @GrpcMethod(FOLLOWSERVICE, FollowServiceMethod.FollowUser)
  public async follow(data: any, metadata: Metadata) {
    const { userId } = await this.followValidation.validateFollow(data);
    const { id } = this.getUserFromMetadata(metadata);

    if (await this.followService.findOneByFollow(userId, id))
      throw new RpcException({
        message: 'data is already exists',
        code: Status.ALREADY_EXISTS,
      });

    return (await this.followService.createOne(userId, id))?.dataValues;
  }

  @GrpcMethod(FOLLOWSERVICE, FollowServiceMethod.GetMyFollow)
  public async getMyFollow(data: any, metadata: Metadata) {
    const { page, limit } = await this.followValidation.validateGetFollow(data);
    const { id } = this.getUserFromMetadata(metadata);

    const datas = await this.followService.myFollow(id, { page, limit });
    if (!datas.length)
      throw new RpcException({
        message: 'data not found',
        code: Status.NOT_FOUND,
      });

    return { datas };
  }

  @GrpcMethod(FOLLOWSERVICE, FollowServiceMethod.GetMyFollower)
  public async getMyFollower(data: any, metadata: Metadata) {
    const { page, limit } = await this.followValidation.validateGetFollow(data);
    const { id } = this.getUserFromMetadata(metadata);

    const datas = await this.followService.myFollower(id, { page, limit });
    if (!datas.length)
      throw new RpcException({
        message: 'data not found',
        code: Status.NOT_FOUND,
      });

    return { datas };
  }
}
