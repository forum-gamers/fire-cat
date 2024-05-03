import { DataTypes } from 'sequelize';
import {
  Table,
  Model,
  Column,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from './user';

export interface CoachAttributes {
  id: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
}

@Table<Model<CoachAttributes, any>>({
  tableName: 'Coaches',
  modelName: 'Coaches',
})
export class Coach extends Model<CoachAttributes, any> {
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
