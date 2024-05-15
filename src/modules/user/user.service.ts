import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User, type UserAttributes } from '../../models/user';
import { Op, type UpdateOptions, type CreateOptions } from 'sequelize';
import type { CreateUserProps } from './user.interface';
import { v4 } from 'uuid';
import encryption from '../../helpers/encryption';
import type { AccountType } from '../../interfaces/global.interface';
import { Admin } from '../../models/admin';
import { Coach } from '../../models/coach';

@Injectable()
export class UserService {
  constructor(
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

  public async findByEmail(email: string) {
    return await this.userModel.findOne({ where: { email } });
  }

  public async findByIdAndPreload(id: string, accountType: AccountType) {
    return await this.userModel.findOne({
      where: { id },
      include: (() => {
        switch (accountType) {
          case 'Admin':
            return { model: Admin };
          case 'Coach':
            return { model: Coach };
          default:
            return [];
        }
      })(),
    });
  }

  public async findMultipleByIds(ids: string[]) {
    return await this.userModel.findAll({
      where: {
        id: { [Op.in]: ids },
      },
    });
  }

  public async changeProfile(
    id: string,
    imageUrl: string,
    imageId: string,
    opts?: UpdateOptions<UserAttributes>,
  ) {
    return await this.userModel.update(
      { imageId, imageUrl },
      { ...opts, where: { id } },
    );
  }

  public async changeBackground(
    id: string,
    backgroundImageUrl: string,
    backgroundImageId: string,
    opts?: UpdateOptions<UserAttributes>,
  ) {
    return await this.userModel.update(
      { backgroundImageId, backgroundImageUrl },
      { ...opts, where: { id } },
    );
  }

  public async activatedUser(id: string) {
    return await this.userModel.update({ isVerified: true }, { where: { id } });
  }

  public async updateRole(
    id: string,
    role: AccountType,
    opts?: UpdateOptions<UserAttributes>,
  ) {
    return await this.userModel.update({ role }, { ...opts, where: { id } });
  }
}
