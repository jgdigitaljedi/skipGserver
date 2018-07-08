var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.register = function(req, res) {
	var user = new User();

	user.name = req.body.name;
	user.email = req.body.email;
	user.admin = false;

	user.setPassword(req.body.password);

	user.save(function(err) {
		var token;
		token = user.generateJwt();
		res.status(200);
		res.json({
			token: token,
			admin: false
		});
	});
};

module.exports.login = function(req, res) {
	passport.authenticate('local', function(err, user, info) {
		var token;

		// If Passport throws/catches an error
		if (err) {
			res.status(404).json(err);
			return;
		}

		// If a user is found
		if (user) {
			token = user.generateJwt();
			res.status(200);
			res.json({
				token: token,
				admin: user.admin
			});
		} else {
			// If user is not found
			res.status(401).json(info);
		}
	})(req, res);
};

module.exports.devUser = function(req, res) {
	var env = process.env.NODE_ENV || 'development';
	if (env === 'production') {
		res.status(401).json({ message: 'This is only available in development for testing purposes.' });
	} else {
		var user = new User();

		user.name = req.body.name;
		user.email = req.body.email;
		user.admin = false;

		user.setPassword(req.body.password);
		var token;
		token = user.generateJwt();
		res.status(200).json({ token: token, user: user });
	}
};
