import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';
import bcrypt from 'bcrypt';

export const MAX_FAILED_ATTEMPTS = 5;
export const LOCK_TIME = 15 * 60 * 1000;

export interface IUserMethods {
  isUserLocked(): boolean;
  addFailedAttempts(): Promise<void>;
  resetFailedAttempts(): Promise<void>;
}

export interface UserModel extends Model, IUserMethods {
  id: number;
  name: string;
  email: string;
  password: string;
  failedAttempts: number;
  isLocked: boolean;
  lockUntil: Date | null;
  createdAt: Date;
}

export const User = sequelize.define<UserModel>('users', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [1, 32],
        msg: 'Размер поля мал или велик',
      },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  failedAttempts: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  isLocked: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  lockUntil: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

// Добавляем методы к прототипу модели
(User.prototype as UserModel).isUserLocked = function() {
  if (!this.isLocked) return false;

  if (this.lockUntil && new Date() > this.lockUntil) {
    this.isLocked = false;
    this.failedAttempts = 0;
    this.lockUntil = null;
    return false;
  }

  return true;
};

(User.prototype as UserModel).addFailedAttempts = async function() {
  this.failedAttempts += 1;

  if (this.failedAttempts >= MAX_FAILED_ATTEMPTS) {
    this.isLocked = true;
    this.lockUntil = new Date(Date.now() + LOCK_TIME);
  }

  await this.save();
};

(User.prototype as UserModel).resetFailedAttempts = async function() {
  this.failedAttempts = 0;
  await this.save();
};

User.beforeCreate(async (user: UserModel) => {
  try {
    user.password = await bcrypt.hash(user.password, 10);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Ошибка при хешировании пароля: ' + error.message);
    }
    throw new Error('Ошибка при хешировании пароля');
  }
});
