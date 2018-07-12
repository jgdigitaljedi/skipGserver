const express = require('express');
const router = express.Router();
const ctrlPhotos = require('../controllers/photos.controller');
const uploadMw = require('../config/upload');

router.get('/', ctrlPhotos.getList);
router.get('/info/:id', ctrlPhotos.getPhotoInfo);
router.post('/', uploadMw.single('photo'), ctrlPhotos.uploadPhotos);
router.get('/:id', ctrlPhotos.downloadPhoto);
router.post('/all', ctrlPhotos.downloadAll);
router.delete('/', ctrlPhotos.deletePhoto);

router.post('/tag', ctrlPhotos.getPhotoByTag);
router.post('/uploader/id', ctrlPhotos.getPhotoByUploaderId);
router.post('/uploader/name', ctrlPhotos.getPhotoByUploaderName);
router.patch('/tag/:id', ctrlPhotos.editTags);
router.patch('/comment/:id', ctrlPhotos.editComments);

module.exports = router;
