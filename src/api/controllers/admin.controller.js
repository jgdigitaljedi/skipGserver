var mongoose = require('mongoose');
var User = mongoose.model('User');

// get user - get specific user
// delete user - remove user
// patch user - suspend account for a while and/or modify user

module.exports.listUsers = function(req, res) {
	if (!req.payload.admin) {
		res.status(401).send('UNARTHORIZED: Access denied! You must be an admin to get all users!');
	} else {
		User.find({}, function(err, users) {
			if (err) {
				res.status(503).send('ERROR: Something went wrong with fetching list of users.');
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
