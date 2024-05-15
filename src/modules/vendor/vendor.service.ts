import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Vendor, type VendorAttributes } from '../../models/vendor';
import type { CreateVendorProps, UpdateImgProps } from './vendor.interface';
import { type UpdateOptions, type CreateOptions } from 'sequelize';

@Injectable()
export class VendorService {
  constructor(
    @InjectModel(Vendor)
    private readonly vendorModel: typeof Vendor,
  ) {}

  public async createVendor(
    args: CreateVendorProps,
    opts?: CreateOptions<VendorAttributes>,
  ) {
    return await this.vendorModel.create(
      {
        userId: args.userId,
        name: args.name,
        description: args.description,
        imageUrl: args?.imageUrl ?? '',
        imageId: args?.imageId ?? '',
        backgroundImageUrl: args?.backgroundImageUrl ?? '',
        backgroundImageId: args?.backgroundImageId ?? '',
      },
      opts,
    );
  }

  public async updateImage(
    userId: string,
    { url, fileId }: UpdateImgProps,
    opts?: UpdateOptions<VendorAttributes>,
  ) {
    return await this.vendorModel.update(
      { imageUrl: url, imageId: fileId },
      { ...opts, where: { userId } },
    );
  }

  public async findByUserId(userId: string) {
    return await this.vendorModel.findOne({ where: { userId } });
  }

  public async updateBg(
    userId: string,
    { url, fileId }: UpdateImgProps,
    opts?: UpdateOptions<VendorAttributes>,
  ) {
    return await this.vendorModel.update(
      { backgroundImageUrl: url, backgroundImageId: fileId },
      { ...opts, where: { userId } },
    );
  }
}
