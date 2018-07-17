const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const logger = require('../config/winston');

module.exports.register = function(req, res) {
	const user = new User();

	user.name = req.body.name;
	user.email = req.body.email;
	user.admin = false;

	user.setPassword(req.body.password);

	user.save(function(err) {
		if (err) {
			logger.logThis(err, req);
			res.status(500).json({ error: err, message: 'ERROR: Problem saving new user to DB.' });
		} else {
			let token;
			token = user.generateJwt();
			res.status(200);
			res.json({
				token: token,
				admin: false
			});
		}
	});
};

module.exports.login = function(req, res) {
	passport.authenticate('local', (err, user, info) => {
		let token;

		// If Passport throws/catches an error
		if (err) {
			logger.logThis(err, req);
			res.status(404).json({ error: err, message: 'ERROR: Error with Passport.' });
			return;
		}

		// If a user is found
		if (user) {
			try {
				token = user.generateJwt();
				res.status(200);
				res.json({
					token: token,
					admin: user.admin
				});
			} catch (e) {
				logger.logThis(e, req);
				res.status(500).json({ error: e, message: 'ERROR: Problem logging in.' });
			}
		} else {
			// If user is not found
			res.status(401).json(info);
		}
	})(req, res);
};

module.exports.devUser = function(req, res) {
	const env = process.env.NODE_ENV || 'development';
	if (env === 'production') {
		res.status(401).json({ message: 'This is only available in development for testing purposes.' });
	} else {
		const user = new User();

		user.name = req.body.name;
		user.email = req.body.email;
		user.admin = false;

		user.setPassword(req.body.password);
		let token;
		token = user.generateJwt();
		res.status(200).json({ token: token, user: user });
	}
};
