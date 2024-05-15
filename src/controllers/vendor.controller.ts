import { Controller, UseInterceptors } from '@nestjs/common';
import { BaseController } from '../base/controller.base';
import { AuthenticationInterceptor } from '../middlewares/authentication.middleware';
import { VendorService } from '../modules/vendor/vendor.service';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { VENDORSERVICE } from '../constants/vendor.constant';
import { VendorServiceEnum } from '../enum/vendor.enum';
import { Metadata } from '@grpc/grpc-js';
import { VendorValidation } from '../modules/vendor/vendor.validation';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { Sequelize } from 'sequelize-typescript';
import { UserService } from '../modules/user/user.service';

@Controller()
@UseInterceptors(AuthenticationInterceptor)
export class VendorController extends BaseController {
  constructor(
    private readonly vendorService: VendorService,
    private readonly vendorValidation: VendorValidation,
    private readonly sequelize: Sequelize,
    private readonly userService: UserService,
  ) {
    super();
  }

  @GrpcMethod(VENDORSERVICE, VendorServiceEnum.CreateVendorAccount)
  public async createVendorAccount(payload: any, metadata: Metadata) {
    const transaction = await this.sequelize.transaction();
    try {
      const { name, description, image, background } =
        await this.vendorValidation.validateCreateVendorAccount(payload);

      const { isVerified, role, id } = this.getUserFromMetadata(metadata);
      if (!isVerified)
        throw new RpcException({
          message: 'account unverified, please check your email',
          code: Status.UNAUTHENTICATED,
        });

      if (role !== null)
        throw new RpcException({
          message: 'user already has a role',
          code: Status.ALREADY_EXISTS,
        });

      const vendor = await this.vendorService.createVendor(
        {
          userId: id,
          name,
          description,
          imageUrl: image?.url ?? '',
          imageId: image?.fileId ?? '',
          backgroundImageUrl: background?.url ?? '',
          backgroundImageId: background?.fileId ?? '',
        },
        { transaction },
      );

      await this.userService.updateRole(id, 'Vendors', { transaction } as any);
      await transaction.commit();

      return vendor;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
}
