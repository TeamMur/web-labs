import { Sequelize } from "sequelize";
import { sequelize } from "../config/db.js";
import bcrypt from "bcrypt";

export const MAX_FAILED_ATTEMPTS = 5;
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
    failedAttempts: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    isLocked: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    lockUntil: {
        type: Sequelize.DATE,
        allowNull: true
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

User.prototype.isUserLocked = function() {
    if (!this.isLocked) return false;
    
    //отмена бана если время вышло
    if (this.lockUntil && new Date() > this.lockUntil) {
        this.isLocked = false;
        this.failedAttempts = 0;
        this.lockUntil = null;
        return false;
    }
    
    return true;
};

User.prototype.addFailedAttempts = async function() {
    this.failedAttempts += 1;
    
    //бан при превышении количества попыток
    if (this.failedAttempts >= MAX_FAILED_ATTEMPTS) {
        this.isLocked = true;
        this.lockUntil = new Date(Date.now() + LOCK_TIME);
    }
    
    await this.save();
};

User.prototype.resetFailedAttempts = async function() {
    this.failedAttempts = 0;
    await this.save();
};