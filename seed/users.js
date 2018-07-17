// seeds test and admin user to dev db
(function () {
  const mongoose = require('mongoose');
  const db = require('../src/api/models/db.model');

  mongoose.connect('mongodb://localhost:27017/skipg', { useNewUrlParser: true });
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

  User.remove({}, (err) => {
    if (!err) {
      seedThis.forEach((item) => {
        const user = new User();

        user.firstName = item.firstName;
        user.lastName = item.lastName;
        user.email = item.email;
        user.admin = item.admin;
        user.joinDateAdd();
        user.profileUpdated();

        user.setPassword(item.password);

        user.save(function (err) {
          if (err) {
            console.error('ERROR: Problem seeding DB.');
          } else {
            console.log(`SUCCESS! Seeded ${item.name} to your DB!`);
          }
        });
      });
    }
  });
})();

