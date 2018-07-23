const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const logger = require('../config/winston');
const crypto = require('crypto');
const Email = require('../config/email');
const moment = require('moment');

/**
 * POST /users/register
 * Registers user
 * req.body.email, req.body.firstName, req.body.lastName?, req.body.password
 * @param {*} req 
 * @param {*} res 
 */
module.exports.register = function (req, res) {
	const user = new User();

	user.firstName = req.body.firstName;
	user.lastName = req.body.hasOwnProperty('lastName') ? req.body.lastName : null;
	user.email = req.body.email;
	user.admin = false;
	user.joinDateAdd();
	user.profileUpdated();

	user.setPassword(req.body.password);

	user.save(function (err) {
		if (err) {
			logger.logThis(err, req);
			res.status(500).json({ error: err, message: 'ERROR: Problem saving new user to DB.' });
		} else {
			let token;
			token = user.generateJwt();
			res.status(200);
			res.json({
				token: token,
				admin: false,
				joinDate: user.joinDate,
				lastUpdated: user.lastUpdated,
				firstName: user.firstName,
				lastName: user.lastName
			});
		}
	});
};

/**
 * POST /users/login
 * Logs user in and returns token and basic info
 * req.body.email, req.body.password
 * @param {*} req 
 * @param {*} res 
 */
module.exports.login = function (req, res) {
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
					admin: user.admin,
					joinDate: user.joinDate,
					lastUpdated: user.lastUpdated,
					firstName: user.firstName,
					lastName: user.lastName
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

/**
 * DELETE /users
 * Deletes a user from the system
 * req.body.password, req.body.email (for extra security they must send creds again)
 * @param {*} req 
 * @param {*} res 
 */
module.exports.deleteMe = function (req, res) {
	User.findById(req.payload._id, (error, user) => {
		if (error) {
			logger.logThis(error, req);
			res.status(500).json({ error, message: 'ERROR: Problem fetching user info to delete.' });
		} else {
			const sentPwHas = crypto.pbkdf2Sync(req.body.password, user.salt, 1000, 64, 'sha512').toString('hex');
			if (req.body.email === user.email && sentPwHas === user.hash) {
				user.remove((err) => {
					if (err) {
						logger.logThis(err, req);
						res.status(500).json({ error: err, message: 'ERROR: Problem deleting user after found.' });
					} else {
						res.status(200).json({ error: false, message: 'User successfully deleted form system.' });
					}
				});
			}
		}
	});
};

/**
 * POST /users/changepw
 * Resets user password
 * req.body.newpass
 * @param {*} req 
 * @param {*} res 
 */
module.exports.changePassword = function (req, res) {
	User.findById(req.payload._id, (error, user) => {
		if (error) {
			logger.logThis(error, req);
			res.status(500).json({ error, message: 'ERROR: Problem fetching user data to change password.' });
		} else {
			user.setPassword(req.body.newpass);
			user.profileUpdated();
			user.save((err) => {
				if (err) {
					logger.logThis(err, req);
					res.status(500).json({ error: err, message: 'ERROR: Problem changing password.' });
				} else {
					res.status(200).json({ error: false, message: 'Password change was successful!' });
				}
			});
		}
	});
};

/**
 * POST /users/reset
 * Route that generate rest token and expiration, saves to DB, and sends link to user
 * req.body.email
 * @param {*} req 
 * @param {*} res 
 */
module.exports.resetPasswordLink = function (req, res) {
	// @TODO: pick an email service and finish this
	// generates reset password good for 2 hours and emails link to user
	if (req.body.email) {
		try {
			User.findOne({ email: req.body.email }, (error, user) => {
				if (error) {
					logger.logThis(error, req);
					res.status(500).json({ error, message: 'ERROR: Problem finding user by email.' });
				} else {
					user.resetToken = crypto.randomBytes(20).toString('hex');
					user.resetTokenExpires = moment().add(2, 'hours');
					user.save((err) => {
						if (err) {
							logger.logThis(err, req);
							res.status(500).json({ error: err, message: 'ERROR: Problem saving reset token for user.' });
						} else {
							Email.sendEmail(user.email, { first: user.firstName, last: user.lastName }, user.resetToken)
								.then(() => {
									res.status(200).json({ error: false, message: 'Password reset link has been sent via email.' });
								})
								.catch((err) => {
									logger.logThis(err, req);
									res.status(500).json({ error: err, message: 'ERROR: Problem sending password reset email.' });
								});
						}
					});
				}
			});
		} catch (e) {
			logger.logThis(e, req);
			res.status(500).json({ error: e, message: 'ERROR: Problem getting user or sending reset email.' });
		}
	} else {
		res.status().json({ error: true, message: 'YOU MUST ENTER YOUR EMAIL ADDRESS TO GET A PASSWORD REST LINK!' });
	}
};

/**
 * POST /users/devuser
 * Dev only endpoint to get register response without registering to DB
 * req.body.email, req.body.firstName, req.body.lastName?, req.body.password
 * @param {*} req 
 * @param {*} res 
 */
module.exports.devUser = function (req, res) {
	const env = process.env.NODE_ENV || 'development';
	if (env === 'production') {
		res.status(401).json({ message: 'This is only available in development for testing purposes.' });
	} else {
		const user = new User();

		user.firstName = req.body.firstName;
		user.lastName = req.body.hasOwnProperty('lastName') ? req.body.lastName : null;
		user.email = req.body.email;
		user.admin = false;
		user.joinDateAdd();
		user.profileUpdated();

		user.setPassword(req.body.password);
		let token;
		token = user.generateJwt();
		res.status(200).json({ token: token, user: user });
	}
};
