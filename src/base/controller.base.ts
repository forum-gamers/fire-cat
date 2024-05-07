import type { Metadata } from '@grpc/grpc-js';
import type { UserAttributes } from '../models/user';

export abstract class BaseController {
  protected getUserFromMetadata(metadata: Metadata): UserAttributes {
    let user: UserAttributes = {} as UserAttributes;
    for (const key of [
      'id',
      'fullname',
      'username',
      'email',
      'bio',
      'isVerified',
      'imageUrl',
      'imageId',
      'backgroundImageUrl',
      'backgroundImageId',
      'status',
      'createdAt',
      'updatedAt',
    ])
      user[key] = metadata.get(key)[0];

    return user;
  }
}
