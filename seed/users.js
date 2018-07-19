// seeds test and admin user to dev db
const mongoose = require('mongoose');
const User = mongoose.model('User');
const seedThis = [
	{
		firstName: 'Tester',
		lastName: 'McTesterson',
		email: 'test@test.com',
		password: 'test',
		admin: false
	},
	{
		firstName: 'Admin',
		lastName: 'O\'Administrator',
		email: 'admin@admin.com',
		password: 'admin',
		admin: true
	}
];
module.exports.seedUsers = function () {
	return new Promise((resolve, reject) => {
		User.remove({}, (err) => {
			if (!err) {
				seedThis.forEach((item, index) => {
					console.log('item', item);
					const user = new User();

					user.firstName = item.firstName;
					user.lastName = item.lastName;
					user.email = item.email;
					user.admin = item.admin;
					user.joinDateAdd();
					user.profileUpdated();

					user.setPassword(item.password);

					user.save(function (err, user) {
						if (err) {
							console.error('ERROR: Problem seeding DB.');
							reject(err);
						} else {
							console.log(`SUCCESS! Seeded ${item.firstName} to your DB!`);
							if (index === 1) {
								resolve(user);
							}
						}
					});
				});
			}
		});
	});
};

