import { DataTypes } from 'sequelize';
import {
  Table,
  Model,
  Column,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './user';

export interface VendorAttributes {
  id: number;
  userId: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TableType = Model & VendorAttributes;

@Table<Model<VendorAttributes>>({
  tableName: 'Vendors',
  modelName: 'Vendors',
})
export class Vendor extends Model<VendorAttributes, any> {
  @Column({
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  })
  public id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: {
        tableName: 'Users',
      },
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  public userId: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'name is required',
      },
      notEmpty: {
        msg: 'name is required',
      },
    },
  })
  public name: string;

  @Column({
    type: DataTypes.TEXT,
    defaultValue: '',
  })
  public description: string;

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

  @BelongsTo(() => User)
  public user: User;
}
