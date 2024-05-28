import { Injectable } from '@nestjs/common';
import { BaseValidation } from '../../base/validation.base';
import * as yup from 'yup';
import type { Pagination } from './follow.interface';

@Injectable()
export class FollowValidation extends BaseValidation {
  public validateFollow = async (data: any) =>
    await this.validate<{ userId: string }>(
      yup.object().shape({
        userId: yup.string().required('userId is required'),
      }),
      data,
    );

  public validateGetFollow = async (data: any) =>
    await this.validate<Pagination>(
      yup.object().shape({
        ...this.basePagination,
      }),
      data,
    );
}
