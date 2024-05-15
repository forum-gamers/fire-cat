import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../../models/user';
import { Vendor } from '../../models/vendor';
import { VendorService } from './vendor.service';

@Module({
  imports: [SequelizeModule.forFeature([User, Vendor])],
  providers: [VendorService],
})
export class VendorModule {}
