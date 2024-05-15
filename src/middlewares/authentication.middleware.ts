import { Status } from '@grpc/grpc-js/build/src/constants';
import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { type Observable } from 'rxjs';
import jwt from '../helpers/jwt';
import { UserService } from '../modules/user/user.service';
import { User } from '../models/user';
import type { Metadata } from '@grpc/grpc-js';

@Injectable()
export class AuthenticationInterceptor implements NestInterceptor {
  constructor(private readonly userService: UserService) {}

  public async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const metadata = context.switchToRpc().getContext<Metadata>();

    const access_token = metadata.get('access_token');
    if (!access_token || !access_token.length)
      throw new RpcException({
        code: Status.UNAUTHENTICATED,
        message: 'missing or invalid token',
      });

    const { id, accountType } = jwt.verifyToken(access_token[0] as string);
    let user: User | null = null;
    if (accountType !== null)
      user = await this.userService.findByIdAndPreload(id, accountType);
    else user = await this.userService.findOneById(id);

    if (!user)
      throw new RpcException({
        message: 'user might be removed',
        code: Status.DATA_LOSS,
      });

    for (const key in user.dataValues)
      if (
        [
          'id',
          'fullname',
          'username',
          'email',
          'bio',
          'isVerified',
          'imageUrl',
          'imageId',
          'backgroundImageUrl',
          'backgroundImageId',
          'status',
          'createdAt',
          'updatedAt',
        ].includes(key)
      )
        metadata.set(key, user[key]);

    return next.handle().pipe();
  }
}
