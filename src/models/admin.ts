import { DataTypes } from 'sequelize';
import {
  Table,
  Model,
  Column,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import type { AdminDivision, AdminRole } from '../interfaces/global.interface';
import { ADMINDIVISION } from '../constants/admin.constant';
import { User } from './user';

export interface AdminAttributes {
  id: number;
  userId: string;
  division: AdminDivision;
  role: AdminRole;
  createdAt: Date;
  updatedAt: Date;
  user: User;
}

@Table<Model<AdminAttributes>>({
  tableName: 'Admins',
  modelName: 'Admins',
})
export class Admin extends Model<AdminAttributes, any> {
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
    type: DataTypes.ENUM,
    values: ADMINDIVISION,
    allowNull: false,
  })
  public division: AdminDivision;

  @Column({
    type: DataTypes.ENUM,
    values: ['Supervisor', 'Manager', 'Staff'],
    allowNull: false,
  })
  public role: AdminRole;

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
