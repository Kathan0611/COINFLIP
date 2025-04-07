//src/config/database.ts
import { Dialect, Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';

dotenv.config();

const loggingOption = process.env.DB_LOGS === 'true' ? console.log : false;

export const sequelize = new Sequelize(process.env.DB_NAME!, process.env.DB_USER!, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: (process.env.DB_DIALECT as Dialect) || 'mysql',
  logging: loggingOption,
});
