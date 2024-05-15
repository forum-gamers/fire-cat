import { Injectable } from '@nestjs/common';
import { BaseValidation } from '../../base/validation.base';
import type { CreateVendorInput } from './vendor.interface';
import * as yup from 'yup';
import type { FileInput } from '../../interfaces/global.interface';

@Injectable()
export class VendorValidation extends BaseValidation {
  public validateCreateVendorAccount = async (data: any) =>
    await this.validate<CreateVendorInput>(
      yup.object().shape({
        name: yup.string().required('name is required'),
        description: yup.string().optional().default(''),
        image: yup
          .object()
          .shape(this.yupFile)
          .default(null)
          .optional()
          .nullable(),
        background: yup
          .object()
          .shape(this.yupFile)
          .default(null)
          .optional()
          .nullable(),
      }),
      data,
    );

  public validateUpdateImg = async (data: any) =>
    await this.validate<FileInput>(yup.object().shape(this.yupFile), data);

  public validateUpdateDesc = async (data: any) =>
    await this.validate<{ desc: string }>(
      yup.object().shape({
        desc: yup.string().required('desc is required'),
      }),
      data,
    );
}
