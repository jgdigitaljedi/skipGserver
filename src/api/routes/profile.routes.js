var express = require('express');
var router = express.Router();
var ctrlProfile = require('../controllers/profile.controller');

router.get('/', ctrlProfile.profileRead);
router.patch('/', ctrlProfile.profileUpdate);

module.exports = router;
