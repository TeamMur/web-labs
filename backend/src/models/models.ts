import { User } from './user';
import { Event } from './event';
import { Model } from 'sequelize';

interface UserModel extends Model {
  hasMany: (model: typeof Event, options: { foreignKey: string }) => void;
}

(User as unknown as UserModel).hasMany(Event, { foreignKey: 'createdBy' });

export { User, Event };
