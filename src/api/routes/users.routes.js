var express = require('express');
var router = express.Router();
var ctrlAuth = require('../controllers/authentication.controller');

router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

module.exports = router;
