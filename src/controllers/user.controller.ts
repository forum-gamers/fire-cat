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
import { BaseController } from '../base/controller.base';
import { Mailer } from '../libs/mailer';

@Controller()
export class UserController extends BaseController {
  constructor(
    private readonly userService: UserService,
    private readonly userValidation: UserValidation,
    private readonly sequelize: Sequelize,
    private readonly coachService: CoachService,
    private readonly emailService: Mailer,
  ) {
    super();
  }

  @GrpcMethod(USERSERVICE, UserServiceMethod.Register)
  public async register(data: any, _: Metadata) {
    const transaction = await this.sequelize.transaction();
    try {
      const {
        fullname,
        username,
        email,
        password,
        role = null,
        phoneNumber,
      } = await this.userValidation.validateRegister(data);

      const existing = await this.userService.findByQuery({
        username,
        email,
        phoneNumber,
      });
      if (existing.length)
        for (const data of existing)
          switch (true) {
            case data.email === email:
              throw new RpcException({
                message: `${email} is already use`,
                code: Status.ALREADY_EXISTS,
              });
            case data.username === username:
              throw new RpcException({
                message: `${username} is already use`,
                code: Status.ALREADY_EXISTS,
              });
            case data.phoneNumber === phoneNumber:
              throw new RpcException({
                message: `${phoneNumber} is already use`,
                code: Status.ALREADY_EXISTS,
              });
            default:
              break;
          }

      const user = await this.userService.createOne(
        {
          fullname,
          username: global.replaceSpecialChar(username),
          email,
          password,
          phoneNumber,
        },
        { transaction },
      );

      if (role === 'Coach')
        await this.coachService.createOne(user.id, { transaction });

      const tokenValue = {
        id: user.id,
        accountType: user.role,
        username: user.username,
        isVerified: user.isVerified,
      };
      await this.emailService.sendConfirmEmail(email, tokenValue);

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
        token: jwt.createToken(tokenValue),
      };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  @GrpcMethod(USERSERVICE, UserServiceMethod.Login)
  public async login(data: any, _: Metadata) {
    const {
      email,
      password,
      as = null,
    } = await this.userValidation.validateLogin(data);

    const user = await this.userService.findByEmail(email);
    if (!user || !encryption.compareEncryption(password, user.password))
      throw new RpcException({
        message: 'invalid credentials',
        code: Status.UNAUTHENTICATED,
      });

    if (!user.isVerified)
      throw new RpcException({
        message: 'account unverified, please check your email',
        code: Status.UNAUTHENTICATED,
      });

    return {
      token: jwt.createToken({
        id: user.id,
        accountType: as,
        username: user.username,
        isVerified: user.isVerified,
      }),
    };
  }

  @GrpcMethod(USERSERVICE, UserServiceMethod.Me)
  @UseInterceptors(AuthenticationInterceptor)
  public me(_: any, metadata: Metadata) {
    return { data: this.getUserFromMetadata(metadata) };
  }

  @GrpcMethod(USERSERVICE, UserServiceMethod.GetMultipleUser)
  @UseInterceptors(AuthenticationInterceptor)
  public async getMultipleByUserIds({ ids }: { ids: string[] }, _: Metadata) {
    if (!ids?.length)
      throw new RpcException({
        code: Status.INVALID_ARGUMENT,
        message: 'parameter ids is required',
      });

    const data: string[] = [];
    ids.forEach((el) => {
      if (!data.includes(el) && global.isValidUUID(el) && el) data.push(el);
    });

    if (data.length > 25)
      throw new RpcException({
        message: 'Data limit exceeded',
        code: Status.RESOURCE_EXHAUSTED,
      });

    if (!data.length)
      throw new RpcException({
        code: Status.INVALID_ARGUMENT,
        message: 'no ids is valid',
      });

    const users = await this.userService.findMultipleByIds(data);
    if (!users.length)
      throw new RpcException({
        message: 'no data found',
        code: Status.NOT_FOUND,
      });

    return {
      data: users.map(({ dataValues: user }) => ({
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
      })),
    };
  }

  @GrpcMethod(USERSERVICE, UserServiceMethod.GetUserById)
  @UseInterceptors(AuthenticationInterceptor)
  public async getById({ id }: { id: string }, _: Metadata) {
    if (!id || !global.isValidUUID(id))
      throw new RpcException({
        message: 'invalid parameter id',
        code: Status.INVALID_ARGUMENT,
      });

    const data = await this.userService.findOneById(id);
    if (!data)
      throw new RpcException({
        message: 'data not found',
        code: Status.NOT_FOUND,
      });

    return { data };
  }

  @GrpcMethod(USERSERVICE, UserServiceMethod.ChangeProfileImg)
  @UseInterceptors(AuthenticationInterceptor)
  public async changeProfileImg(payload: any, metadata: Metadata) {
    const { url, fileId } =
      await this.userValidation.validateChangeProfile(payload);

    const { id, imageUrl, imageId } = this.getUserFromMetadata(metadata);

    await this.userService.changeProfile(id, url, fileId);

    return { message: imageUrl ? imageId : 'success' };
  }

  @GrpcMethod(USERSERVICE, UserServiceMethod.ChangeBackgroundImg)
  @UseInterceptors(AuthenticationInterceptor)
  public async changeBackground(payload: any, metadata: Metadata) {
    const { url, fileId } =
      await this.userValidation.validateChangeProfile(payload);

    const { id, backgroundImageUrl, backgroundImageId } =
      this.getUserFromMetadata(metadata);

    await this.userService.changeBackground(id, url, fileId);

    return { message: backgroundImageUrl ? backgroundImageId : 'success' };
  }

  @GrpcMethod(USERSERVICE, UserServiceMethod.ChangeVerified)
  public async changeVerified(payload: any, metadata: Metadata) {
    const { token } = await this.userValidation.validateTokenVerified(payload);

    const { id } = jwt.verifyToken(token, 'invalid token');
    await this.userService.activatedUser(id);

    return { message: 'success' };
  }

  @GrpcMethod(USERSERVICE, UserServiceMethod.ResendEmailVerification)
  public async resend(payload: any, metadata: Metadata) {
    const { email } = await this.userValidation.validateEmailInput(payload);

    const user = await this.userService.findByEmail(email);
    if (!user)
      throw new RpcException({
        message: 'user not found',
        code: Status.NOT_FOUND,
      });

    if (user.isVerified)
      throw new RpcException({
        message: 'user is already verified',
        code: Status.ALREADY_EXISTS,
      });

    await this.emailService.sendConfirmEmail(email, {
      id: user.id,
      accountType: user.role,
      username: user.username,
      isVerified: user.isVerified,
    });

    return { message: 'success' };
  }
}
