import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Vendor } from '../../models/vendor';

@Injectable()
export class VendorService {
  constructor(
    @InjectModel(Vendor)
    private readonly vendorModel: typeof Vendor,
  ) {}
}
