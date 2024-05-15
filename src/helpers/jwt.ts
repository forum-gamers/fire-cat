import { Status } from '@grpc/grpc-js/build/src/constants';
import { RpcException } from '@nestjs/microservices';
import {
  type JwtPayload,
  verify,
  decode,
  type DecodeOptions,
  sign,
  type SignOptions,
} from 'jsonwebtoken';
import type { AccountType } from '../interfaces/global.interface';

export type JwtValue = JwtPayload & TokenValue;

export interface TokenValue {
  id: string;
  accountType: AccountType;
  username: string;
  isVerified: boolean;
}

class Jwt {
  public verifyToken(token: string, message = 'missing or invalid token') {
    try {
      return verify(token, process.env.SECRET) as unknown as JwtValue;
    } catch (err) {
      throw new RpcException({
        message,
        code: Status.UNAUTHENTICATED,
      });
    }
  }

  public decodeToken(token: string, opts?: DecodeOptions) {
    return decode(token, opts) as JwtValue;
  }

  public createToken(data: TokenValue, opts?: SignOptions) {
    return sign(data, process.env.SECRET, opts);
  }
}

export default new Jwt();
