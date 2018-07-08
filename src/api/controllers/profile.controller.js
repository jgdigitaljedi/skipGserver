var mongoose = require('mongoose');
var User = mongoose.model('User');

function unarthorizedResponse(res) {
	res.status(401).json({
		message: 'UnauthorizedError: private profile'
	});
}

module.exports.profileRead = function(req, res) {
	if (!req.payload._id) {
		unarthorizedResponse(res);
	} else {
		User.findById(req.payload._id).exec(function(err, user) {
			res.status(200).json({ name: user.name, email: user.email, admin: user.admin });
		});
	}
};

module.exports.profileUpdate = function(req, res) {
	// res.status(200).json({ request: req.body, payload: req.payload });
	if (!req.payload._id) {
		unarthorizedResponse(res);
	} else {
		User.findOneAndUpdate(
			{ _id: req.payload._id },
			{ $set: req.body },
			{ runValidators: true, upsert: true },
			function(err, result) {
				if (err) {
					res.status(503).send('ERROR: Error updating user data.');
				} else {
					res.status(200).json(Object.assign(result, req.body));
				}
			}
		);
	}
};
