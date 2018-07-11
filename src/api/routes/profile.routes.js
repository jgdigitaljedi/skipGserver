const express = require('express');
const router = express.Router();
const ctrlProfile = require('../controllers/profile.controller');

router.get('/', ctrlProfile.profileRead);
router.patch('/', ctrlProfile.profileUpdate);

module.exports = router;
