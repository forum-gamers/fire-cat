'use strict';

import { Options, Sequelize } from 'sequelize';
import { User } from './user';

const config = require('../../config/config.json');
let sequelize: Sequelize;
const production: string = process.env[config.use_env_variable] as string;

if (process.env.NODE_ENV === 'test') {
  sequelize = new Sequelize(
    config.test.database,
    config.test.username,
    config.test.password,
    <Options>config.test,
  );
} else if (
  process.env.NODE_ENV === 'production' ||
  process.env[config.use_env_variable]
) {
  sequelize = new Sequelize(production, <Options>config.production);
} else {
  sequelize = new Sequelize(
    config.development.database,
    config.development.username,
    config.development.password,
    <Options>config.development,
  );
}

let models = [User];
models.forEach((model) => model.initialize(sequelize));

export { sequelize as Db, User };
