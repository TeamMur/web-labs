import { User } from '@models/user';
import { Event } from '@models/event';
import { Model } from 'sequelize';

interface UserModel extends Model {
  hasMany: (model: typeof Event, options: { foreignKey: string }) => void;
}

(User as unknown as UserModel).hasMany(Event, { foreignKey: 'createdBy' });

export { User, Event };
