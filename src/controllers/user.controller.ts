import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { UserService } from '../modules/user/user.service';
import { USERSERVICE } from '../constants/user.constants';
import { UserServiceMethod } from '../enum/user.enum';
import { UserValidation } from '../modules/user/user.validation';
import type { Metadata } from '@grpc/grpc-js';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { Sequelize } from 'sequelize-typescript';
import { CoachService } from '../modules/coach/coach.service';
import encryption from '../helpers/encryption';
import jwt from '../helpers/jwt';
import global from '../helpers/global';
import { AuthenticationInterceptor } from '../middlewares/authentication.middleware';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userValidation: UserValidation,
    private readonly sequelize: Sequelize,
    private readonly coachService: CoachService,
  ) {}

  //@ts-ignore
  @GrpcMethod(USERSERVICE, UserServiceMethod.Register)
  public async register(data: any, _: Metadata) {
    const transaction = await this.sequelize.transaction();
    try {
      const {
        fullname,
        username,
        email,
        password,
        role = 'Professional',
      } = await this.userValidation.validateRegister(data);

      const existing = await this.userService.findByQuery({
        username,
        email,
      });
      if (existing.length)
        for (const data of existing) {
          if (data.email === email)
            throw new RpcException({
              message: `${email} is already use`,
              code: Status.ALREADY_EXISTS,
            });

          if (data.username === username)
            throw new RpcException({
              message: `${username} is already use`,
              code: Status.ALREADY_EXISTS,
            });
        }

      const user = await this.userService.createOne(
        { fullname, username, email, password },
        { transaction },
      );

      if (role === 'Coach')
        await this.coachService.createOne(user.id, { transaction });

      await transaction.commit();
      return {
        data: {
          id: user.id,
          fullname: user.fullname,
          username: user.username,
          email: user.email,
          isVerified: user.isVerified,
          bio: user.bio,
          imageUrl: user.imageUrl,
          imageId: user.imageId,
          backgroundImageUrl: user.backgroundImageUrl,
          backgroundImageId: user.backgroundImageId,
          status: user.status,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  //@ts-ignore
  @GrpcMethod(USERSERVICE, UserServiceMethod.Login)
  public async login(data: any, _: Metadata) {
    const {
      email,
      password,
      as = 'Professional',
    } = await this.userValidation.validateLogin(data);

    const user = await this.userService.findByEmail(email);
    if (!user || !encryption.compareEncryption(password, user.password))
      throw new RpcException({
        message: 'invalid credentials',
        code: Status.UNAUTHENTICATED,
      });

    return {
      token: jwt.createToken({ id: user.id, accountType: as }),
    };
  }

  //@ts-ignore
  @GrpcMethod(USERSERVICE, UserServiceMethod.Me)
  @UseInterceptors(AuthenticationInterceptor)
  public me(_: any, metadata: Metadata) {
    return { data: global.getUserFromMetadata(metadata) };
  }
}
