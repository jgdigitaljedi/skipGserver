var express = require('express');
var router = express.Router();
var ctrlAdmin = require('../controllers/admin.controller');

router.get('/listusers', ctrlAdmin.listUsers);
router.delete('/deleteuser', ctrlAdmin.deleteUser);

module.exports = router;
