import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Vendor, type VendorAttributes } from '../../models/vendor';
import type { CreateVendorProps } from './vendor.interface';
import { type CreateOptions } from 'sequelize';

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
}
