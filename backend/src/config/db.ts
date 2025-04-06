import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const NAME: string | undefined = process.env.DB_NAME;
const USER: string | undefined = process.env.DB_USER;
const PASSWORD: string | undefined = process.env.DB_PASSWORD;
const HOST: string | undefined = process.env.DB_HOST;
const PORT: string | undefined = process.env.DB_PORT;

if (!NAME || !USER || !PASSWORD || !HOST || !PORT) {
  throw new Error('Database configuration is incomplete');
}

const sequelize = new Sequelize(NAME, USER, PASSWORD, {
  dialect: 'postgres',
  host: HOST,
  port: Number(PORT),
  logging: false,
});

export { sequelize };
