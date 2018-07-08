var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
	secret: process.env.SKIPGSECRET,
	userProperty: 'payload'
});

// var ctrlProfile = require('../controllers/profile.controller');

// profile
// router.get('/profile', auth, ctrlProfile.profileRead);
router.use('/profile', auth, require('./profile.routes'));

// authentication
router.use('/user', require('./users.routes'));

// photos
router.use('/photos', require('./photos.routes'));

// admin
router.use('/admin', auth, require('./admin.routes'));

module.exports = router;
