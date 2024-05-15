import type { Metadata } from '@grpc/grpc-js';
import type { UserAttributes } from '../models/user';
import { USER_KEY } from '../constants/user.constants';

export abstract class BaseController {
  protected getUserFromMetadata(metadata: Metadata): UserAttributes {
    let user: UserAttributes = {} as UserAttributes;
    for (const key of USER_KEY) user[key] = metadata.get(key)[0];

    return user;
  }
}
