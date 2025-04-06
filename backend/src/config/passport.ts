import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions as JwtStrategyOptions,
} from 'passport-jwt';
import passport from 'passport';
import dotenv from 'dotenv';
import { User } from '../models/user';
import { DoneCallback } from 'passport';

dotenv.config();

interface JwtPayload {
  id: number;
}

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}

const options: JwtStrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(options, async (payload: JwtPayload, done: DoneCallback) => {
    try {
      const user = await User.findByPk(payload.id);

      if (!user) return done(null, false);

      return done(null, user);
    } catch (error) {
      return done(error as Error, false);
    }
  }),
);

export default passport;
