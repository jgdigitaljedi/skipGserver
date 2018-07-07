var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
	secret: process.env.SKIPGSECRET,
	userProperty: 'payload'
});

var ctrlProfile = require('../controllers/profile');
var ctrlAuth = require('../controllers/authentication');
var ctrlPhotos = require('../controllers/photos');

// profile
router.get('/profile', auth, ctrlProfile.profileRead);

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

// photos
router.get('/photos/list', ctrlPhotos.getList);
router.post('/photos/upload', ctrlPhotos.uploadPhotos);
router.patch('/photos/delete', ctrlPhotos.deletePhoto);

// admin
// get users - get list of users
// get user - get specific user
// delete user - remove user
// patch user - suspend account for a while and/or modify user
//

module.exports = router;
