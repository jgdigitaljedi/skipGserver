const express = require('express');
const router = express.Router();
const ctrlAdmin = require('../controllers/admin.controller');

router.get('/listusers', ctrlAdmin.listUsers);
router.delete('/deleteuser', ctrlAdmin.deleteUser);

module.exports = router;
