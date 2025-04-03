import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import passport from 'passport'
import dotenv from 'dotenv'
import { User } from '../models/user.js'

dotenv.config()

const options = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_SECRET,
}

passport.use(
	new JwtStrategy(options, async (payload, done) => {
		try {
			const user = await User.findByPk(payload.id)
			
			if (!user) return done(null, false, { message: 'Пользователь не найден' })
			
			return done(null, user)
		} catch (error) {
			return done(error, false, { message: 'Ошибка аутентификации' })
		}
	})
)

export default passport