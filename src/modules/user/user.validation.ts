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
          username: yup
            .string()
            .required('username is required')
            .min(3, 'minimum username character is 3'),
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
            .oneOf(ACCOUNTTYPE, 'invalid account type')
            .optional()
            .nullable()
            .default(null),
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
        email: this.yupEmail,
        password: yup.string().required('password is required'),
        as: yup
          .string()
          .oneOf(ACCOUNTTYPE, 'invalid account type')
          .optional()
          .nullable()
          .default(null),
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

  public validateTokenVerified = async (data: any) =>
    await this.validate<{ token: string }>(
      yup.object().shape({
        token: yup.string().required('token is required'),
      }),
      data,
    );

  public validateEmailInput = async (data: any) =>
    await this.validate<{ email: string }>(
      yup.object().shape({
        email: this.yupEmail,
      }),
      data,
    );
}
