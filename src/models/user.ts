import { DataTypes } from 'sequelize';
import { Table, Model, Column, HasOne } from 'sequelize-typescript';
import { Admin } from './admin';
import { Coach } from './coach';
import type { AccountType } from '../interfaces/global.interface';
import { ACCOUNTTYPE } from '../constants/global.constant';

export interface UserAttributes {
  id: string;
  fullname: string;
  username: string;
  email: string;
  password: string;
  isVerified: boolean;
  bio: string;
  imageUrl: string;
  imageId: string;
  backgroundImageUrl: string;
  backgroundImageId: string;
  status: string;
  accountType: AccountType;
  createdAt: Date;
  updatedAt: Date;
  Admin?: Admin;
  Coach?: Coach;
}

export type TableType = Model & UserAttributes;

@Table<Model<UserAttributes>>({
  tableName: 'Users',
  modelName: 'Users',
})
export class User extends Model<UserAttributes, any> {
  @Column({ type: DataTypes.UUID, primaryKey: true, allowNull: false })
  public id: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'fullname is required',
      },
      notNull: {
        msg: 'fullname is required',
      },
    },
  })
  public fullname: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'username is required',
      },
      notNull: {
        msg: 'username is required',
      },
    },
  })
  public username: string;

  @Column({
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'email is required',
      },
      notNull: {
        msg: 'email is required',
      },
      isEmail: {
        msg: 'invalid email format',
      },
    },
  })
  public email: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'password is required',
      },
      notEmpty: {
        msg: 'password is required',
      },
    },
  })
  public password: string;

  @Column({
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  })
  public isVerified: boolean;

  @Column({
    type: DataTypes.TEXT,
    defaultValue: '',
  })
  public bio: string;

  @Column({
    type: DataTypes.STRING,
    defaultValue: '',
  })
  public imageUrl: string;

  @Column({
    type: DataTypes.STRING,
    defaultValue: '',
  })
  public imageId: string;
  @Column({
    type: DataTypes.STRING,
    defaultValue: '',
  })
  public backgroundImageUrl: string;
  @Column({
    type: DataTypes.STRING,
    defaultValue: '',
  })
  public backgroundImageId: string;

  @Column({
    type: DataTypes.ENUM,
    values: ['active', 'inActive'],
    defaultValue: 'active',
  })
  public status: 'active' | 'inActive';

  @Column({
    type: DataTypes.ENUM,
    values: ACCOUNTTYPE,
    allowNull: false,
    defaultValue: 'Professional',
  })
  public accountType: AccountType;

  @Column({
    allowNull: false,
    type: DataTypes.DATE,
  })
  public createdAt: Date;

  @Column({
    allowNull: false,
    type: DataTypes.DATE,
  })
  public updatedAt: Date;

  @HasOne(() => Admin)
  admin?: Admin;

  @HasOne(() => Coach)
  coach?: Coach;
}
