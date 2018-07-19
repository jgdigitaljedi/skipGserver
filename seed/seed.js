(function () {
  const mongoose = require('mongoose');
  mongoose.connect('mongodb://localhost:27017/skipg', { useNewUrlParser: true });
  require('../src/api/models/users.model');
  require('../src/api/models/photos.model');

  const users = require('./users');
  const photos = require('./photos');

  users.seedUsers()
    .then((user) => {
      photos.seedPhoto(user);
    });
})();
