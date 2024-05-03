import { Sequelize, DataTypes, Model } from 'sequelize';
import type { HookReturn } from 'sequelize/types/hooks';
import encryption from '../helpers/encryption';
import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';

export interface UserAttributes {
  id?: string;
  fullname?: string;
  username?: string;
  email?: string;
  password?: string;
  isVerified?: boolean;
  bio?: string;
  imageUrl?: string;
  imageId?: string;
  backgroundImageUrl?: string;
  backgroundImageId?: string;
  status?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserInstance {
  createdAt: Date;
  updatedAt: Date;

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
}

@Injectable()
export class User extends Model<UserAttributes, any> {
  public fullname!: string;
  public id!: string;
  public username!: string;
  public email!: string;
  public password!: string;
  public isVerified!: boolean;
  public bio!: string;
  public imageUrl!: string;
  public imageId!: string;
  public backgroundImageUrl!: string;
  public backgroundImageId!: string;
  public status!: 'active' | 'inActive';
  public createdAt!: Date;
  public updatedAt!: Date;

  public static associate(models: any) {}

  public static initialize(sequelize: Sequelize) {
    this.init(
      {
        fullname: {
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
        },
        username: {
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
        },
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          allowNull: false,
        },
        email: {
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
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            len: {
              args: [8, 16],
              msg: 'password minimum characters are 8',
            },
            notNull: {
              msg: 'password is required',
            },
            notEmpty: {
              msg: 'password is required',
            },
          },
        },
        isVerified: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },

        bio: {
          type: DataTypes.TEXT,
          defaultValue: '',
        },

        imageUrl: {
          type: DataTypes.STRING,
          defaultValue: '',
        },
        imageId: {
          type: DataTypes.STRING,
          defaultValue: '',
        },

        backgroundImageUrl: {
          type: DataTypes.STRING,
          defaultValue: '',
        },
        backgroundImageId: {
          type: DataTypes.STRING,
          defaultValue: '',
        },

        status: {
          type: DataTypes.ENUM,
          values: ['active', 'nonActive'],
          defaultValue: 'active',
        },

        createdAt: {
          allowNull: false,
          type: DataTypes.DATE,
        },

        updatedAt: {
          allowNull: false,
          type: DataTypes.DATE,
        },
      },
      {
        sequelize,
        modelName: 'Users',
        hooks: {
          beforeCreate: (user, options): HookReturn => {
            user.id = v4();
            user.password = encryption.hash(user.password);
          },
        },
      },
    );
  }
}
