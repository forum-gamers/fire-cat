import { Status } from '@grpc/grpc-js/build/src/constants';
import { RpcException } from '@nestjs/microservices';
import {
  type JwtPayload,
  verify,
  decode,
  type DecodeOptions,
} from 'jsonwebtoken';
import type { AccountType } from '../interfaces/global.interface';

export interface JwtValue extends JwtPayload {
  UUID: string;
  AccountType: AccountType;
}

class Jwt {
  public verifyToken(token: string) {
    try {
      return verify(token, process.env.SECRET) as unknown as JwtValue;
    } catch (err) {
      throw new RpcException({
        message: 'missing or invalid token',
        code: Status.UNAUTHENTICATED,
      });
    }
  }

  public decodeToken(token: string, opts?: DecodeOptions) {
    return decode(token, opts) as JwtValue;
  }
}

export default new Jwt();
