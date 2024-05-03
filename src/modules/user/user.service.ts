import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User, type UserAttributes } from '../../models/user';
import { Op, type CreateOptions } from 'sequelize';
import type { CreateUserProps } from './user.interface';
import { v4 } from 'uuid';
import encryption from '../../helpers/encryption';

@Injectable()
export class UserService {
  constructor(
    //@ts-ignore
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}
  public async findOneById(id: string) {
    return await this.userModel.findOne({ where: { id } });
  }

  public async findByQuery(query: Record<string, string>) {
    return await this.userModel.findAll({
      where: {
        [Op.or]: Object.keys(query).map((el) => ({ [el]: query[el] })),
      },
    });
  }

  public async createOne(
    { fullname, username, email, password }: CreateUserProps,
    opts?: CreateOptions<UserAttributes>,
  ) {
    return await this.userModel.create(
      {
        id: v4(),
        fullname,
        username,
        email,
        password: encryption.hash(password),
        status: 'active',
      },
      opts,
    );
  }
}
