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

    return user;
  }

  public isValidUUID(id: string) {
    return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(
      id,
    );
  }
}

export default new GlobalHelper();
