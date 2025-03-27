import Sequelize from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const NAME = process.env.DB_NAME
const USER = process.env.DB_USER
const PASSWORD = process.env.DB_PASSWORD
const HOST = process.env.DB_HOST
const PORT = process.env.DB_PORT

const sequelize = new Sequelize(NAME, USER, PASSWORD, {
    dialect: USER,
    host: HOST,
    port: PORT,
    logging: false
});

export { sequelize };