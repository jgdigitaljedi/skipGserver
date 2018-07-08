var mongoose = require('mongoose');
var User = mongoose.model('User');

// patch user - suspend account for a while and/or modify user

module.exports.listUsers = function(req, res) {
	if (!req.payload.admin) {
		res.status(403).send('UNAUTHORIZED: Access denied! You must be an admin to get all users!');
	} else {
		User.find({}, function(err, users) {
			if (err) {
				res.status(500).send('ERROR: Something went wrong with fetching list of users.');
			} else {
				var usersCleaned = users.map(function(item) {
					return {
						_id: item._id,
						name: item.name,
						email: item.email
					};
				});
				res.status(200).json(usersCleaned);
			}
		});
	}
};

module.exports.deleteUser = function(req, res) {
	if (req.payload.admin) {
		User.findByIdAndRemove({ _id: req.body._id }, function(err, result) {
			if (err) {
				res.status(500).send('ERROR: Something went wrong with deleting the user.');
			} else {
				res.status(200).json(result);
			}
		});
	} else {
		res.status(403).send('UNAUTHORIZED: Access Denied! You must be an admin to do this.');
	}
};
