import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/user';
import { UserModule } from './modules/user/user.module';
import { Admin } from './models/admin';
import { Coach } from './models/coach';
import { CoachModule } from './modules/coach/coach.module';
const config = require('../config/config.json');
const environment = process.env.NODE_ENV ?? 'development';

@Module({
  imports: [
    SequelizeModule.forRoot({
      username: config[environment].username,
      password: config[environment].password,
      database: config[environment].database,
      dialect: config[environment].dialect,
      uri:
        environment === 'production'
          ? config.production.use_env_variable
          : undefined,
      logging: environment !== 'production',
      pool: {
        idle: 5,
        max: 20,
      },
      models: [User, Admin, Coach],
      synchronize: environment !== 'production',
    }),
    UserModule,
    CoachModule,
  ],
})
export class AppModule {}