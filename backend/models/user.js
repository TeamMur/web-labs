import { Sequelize } from "sequelize";
import { sequelize } from "../config/db.js";
import bcrypt from "bcrypt";

export const MAX_FAILED_ATTEMPTS = 3;
export const LOCK_TIME = 15 * 60 * 1000;

export const User = sequelize.define('users', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [1, 32],
                msg: "Размер поля мал или велик"
            }
        }
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
    }
});

User.beforeCreate(async (user) => {
    try {
        user.password = await bcrypt.hash(user.password, 10);
    } catch (error) {
        throw new Error('Ошибка при хешировании пароля: ' + error.message);
    }
});
