import type { Metadata } from '@grpc/grpc-js';
import type { UserAttributes } from '../models/user';

class GlobalHelper {
  public getUserFromMetadata(metadata: Metadata): UserAttributes {
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

    console.log(metadata);
    return user;
  }
}

export default new GlobalHelper();
