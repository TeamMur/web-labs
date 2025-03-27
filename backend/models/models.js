import { User } from './user.js';
import { Event } from './event.js';

User.hasMany(Event, { foreignKey: 'createdBy' });

export { User, Event }; 