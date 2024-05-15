import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../../models/user';
import { Vendor } from '../../models/vendor';
import { VendorService } from './vendor.service';
import { VendorController } from '../../controllers/vendor.controller';
import { VendorValidation } from './vendor.validation';
import { UserService } from '../user/user.service';

@Module({
  imports: [SequelizeModule.forFeature([User, Vendor])],
  providers: [VendorService, VendorValidation, UserService],
  controllers: [VendorController],
})
export class VendorModule {}
