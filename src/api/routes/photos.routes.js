var express = require('express');
var router = express.Router();
var ctrlPhotos = require('../controllers/photos.controller');

router.get('/', ctrlPhotos.getList);
router.get('/:id', ctrlPhotos.getPhotoInfo);
router.post('/', ctrlPhotos.uploadPhotos);
router.post('/:id', ctrlPhotos.downloadPhoto);
router.post('/all', ctrlPhotos.downloadAll);
router.delete('/', ctrlPhotos.deletePhoto);

router.post('/tag', ctrlPhotos.getPhotoByTag);
router.post('/uploader', ctrlPhotos.getPhotoByUploader);
router.patch('/tag/:id', ctrlPhotos.editTags);
router.patch('/comment/:id', ctrlPhotos.editComments);

module.exports = router;
