import { BaseValidation } from '../../base/validation.base';
import { Injectable } from '@nestjs/common';
import type {
  ChangeProfileInput,
  LoginInputProps,
  RegisterInputProps,
} from './user.interface';
import * as yup from 'yup';
import { ACCOUNTTYPE } from '../../constants/global.constant';

@Injectable()
export class UserValidation extends BaseValidation {
  public validateRegister = async (data: any) =>
    this.validate<RegisterInputProps & { confirmPassword: string }>(
      yup
        .object()
        .shape({
          fullname: yup.string().required('fullname is required'),
          username: yup.string().required('username is required'),
          email: yup
            .string()
            .required('email is required')
            .email('invalid email format'),
          password: yup
            .string()
            .required('password is required')
            .test((val) => this.passwordValidation(val)),
          confirmPassword: yup.string().required('confirmPassword is required'),
          role: yup
            .string()
            .required('role is required')
            .oneOf(ACCOUNTTYPE, 'invalid account type'),
        })
        .test(
          'is same',
          'password and confirm password must equal',
          ({ password, confirmPassword }) => confirmPassword === password,
        ),
      data,
    );

  public validateLogin = async (data: any) =>
    await this.validate<LoginInputProps>(
      yup.object().shape({
        email: yup
          .string()
          .email('invalid email format')
          .required('email is required'),
        password: yup.string().required('password is required'),
        as: yup.string().oneOf(ACCOUNTTYPE, 'invalid account type').optional(),
      }),
      data,
    );

  public validateChangeProfile = async (data: any) =>
    await this.validate<ChangeProfileInput>(
      yup.object().shape({
        url: yup.string().required('url is required').url('invalid url'),
        fileId: yup.string().required('fileId is required'),
      }),
      data,
    );
}
