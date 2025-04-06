import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';

interface IEvent extends Model {
  id: number;
  title: string;
  description?: string;
  date: Date;
  createdBy: number;
}

export const Event = sequelize.define<IEvent>('events', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [1, 50],
        msg: 'Размер поля мал или велик',
      },
    },
  },
  description: {
    type: DataTypes.STRING,
    validate: {
      len: {
        args: [0, 300],
        msg: 'Размер поля велик',
      },
    },
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
});
