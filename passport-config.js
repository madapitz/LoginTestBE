const { Strategy, ExtractJwt } = require('passport-jwt');
const pool = require('./db');

const secret = 'for whom the bell tolls';
const opts = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: secret
};

module.exports = passport => {
	passport.use(
		new Strategy(opts, async (payload, done) => {
			try {
				const user = await pool.query('SELECT u_id, u_email FROM usuario WHERE u_username = $1', [payload.username])
				if(user.rows.length > 0) {
					return done(null, {
						id: user.rows[0].u_id,
						name: user.rows[0].u_fname,
						email: user.rows[0].u_email
					})
				}

				return done(null, false)
			} catch (e) {
				console.log(e)
			}
		})
	);
};