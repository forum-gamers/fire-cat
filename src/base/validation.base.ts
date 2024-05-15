import * as yup from 'yup';
import { RpcException } from '@nestjs/microservices';
import { Status } from '@grpc/grpc-js/build/src/constants';

export abstract class BaseValidation {
  protected async validate<T = any>(schema: yup.Schema, data: any): Promise<T> {
    try {
      return (await schema.validate(data, {
        stripUnknown: true,
        abortEarly: false,
      })) as T;
    } catch (err) {
      const { errors } = err as { errors: string[] };

      throw new RpcException({
        message: errors.length ? errors.join(',\n ') : errors[0],
        code: Status.INVALID_ARGUMENT,
      });
    }
  }

  protected passwordValidation(password: string) {
    const requirements = [
      {
        regex: /(?=.*[a-z])/,
        message: 'password must contain atleast 1 lower case',
      },
      {
        regex: /(?=.*[A-Z])/,
        message: 'password must contain atleast 1 upper case',
      },
      {
        regex: /(?=.*\d)/,
        message: 'password must contain atleast 1 number',
      },
      {
        regex: /(?=.*[!@#$%^&*])/,
        message: 'password must contain atleast 1 symbol',
      },
      {
        regex: /^.{8,}$/,
        message: 'password minimum character must be equal or greater than 8',
      },
    ];
    const errors: string[] = [];

    for (const requirement of requirements)
      if (!requirement.regex.test(password))
        errors.push(new Error(requirement.message).message);

    if (errors.length) throw { errors };

    return true;
  }

  protected yupEmail = yup
    .string()
    .email('invalid email format')
    .required('email is required');

  protected yupFile = {
    url: yup.string().required('url is required'),
    fileId: yup.string().required('fileId is required'),
  };
}
