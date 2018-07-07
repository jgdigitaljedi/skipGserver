var express = require('express');
var router = express.Router();
var ctrlPhotos = require('../controllers/photos.controller');

router.get('/list', ctrlPhotos.getList);
router.post('/upload', ctrlPhotos.uploadPhotos);
router.patch('/delete', ctrlPhotos.deletePhoto);

module.exports = router;
