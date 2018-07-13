const express = require('express');
const router = express.Router();
const ctrlPhotos = require('../controllers/photos.controller');
const uploadMw = require('../config/upload');

/**
 * @api {get} /api/photos Get array of photos from DB
 * @apiName GetPhotos
 * @apiGroup Photos
 * 
 * @apiDescription Gets list of photos from DB and returns as array of objects
 * @apiSuccessExample {json} Success response:
 *    [
 *      {
 *        tags: [],
 *        comments: [],
 *        _id: "9823745982374598237458",
 *        uploadedBy: {
 *          email: "test@test.com",
 *          name: "Tester"
 *        },
 *        uploadDate: "07/11/2018 11:30 am",
 *        __v: 0
 *      }
 *      ...
 *    ]
 */
router.get('/', ctrlPhotos.getList);

/**
 * @api {get} /api/photos/info/:id Get info about photo
 * @apiName GetPhotoInfo
 * @apiGroup Photos
 * 
 * @apiParam {Number} id photoId
 * @apiDescription Gets info about photo from id
 * @apiSuccessExample {json} Success response:
 *    {
 *      tags: [],
 *      comments: [],
 *      _id: "9823745982374598237458",
 *      uploadedBy: {
 *        email: "test@test.com",
 *        name: "Tester"
 *      },
 *      uploadDate: "07/11/2018 11:30 am",
 *      __v: 0
 *    }
 */
router.get('/info/:id', ctrlPhotos.getPhotoInfo);

/**
 * @api {post} /api/photos Upload a photo
 * @apiName UploadPhoto
 * @apiGroup Photos
 * 
 *  @apiExample {json} Example request body:
 *    {photo: <actual multipart-form data with photo file>}
 * @apiDescription Uploads a photo, strips exif metadata, creates 300px wide thumb, and save info to DB
 * @apiSuccessExample {json} Success response:
 *    {
 *      tags: [],
 *      comments: [],
 *      _id: "9823745982374598237458",
 *      uploadedBy: {
 *        email: "test@test.com",
 *        name: "Tester"
 *      },
 *      uploadDate: "07/11/2018 11:30 am",
 *      __v: 0
 *    }
 */
router.post('/', uploadMw.single('photo'), ctrlPhotos.uploadPhotos);

/**
 * @api {get} /api/photos/:id Download photo file
 * @apiName DownloadPhoto
 * @apiGroup Photos
 * 
 * @apiExample {json} Example request body:
 *    {id: 893465708237465}
 * @apiDescription Downloads a photo
 */
router.get('/:id', ctrlPhotos.downloadPhoto);

// @TODO: write this method then write apidoc code block
router.post('/all', ctrlPhotos.downloadAll);

/**
 * @api {delete} /api/photos Delete photo
 * @apiName DeletePhoto
 * @apiGroup Photos
 * 
 * @apiParam {String} id ID of photo to delete
 * @apiPermission admin
 * @apiDescription Deletes photo file, thumb, and DB entry
 * @apiSuccessExample {json} Success response:
 *    {
 *      tags: [],
 *      comments: [],
 *      _id: "9823745982374598237458",
 *      uploadedBy: {
 *        email: "test@test.com",
 *        name: "Tester"
 *      },
 *      uploadDate: "07/11/2018 11:30 am",
 *      __v: 0
 *    }
 */
router.delete('/:id', ctrlPhotos.deletePhoto);

/**
 * @api {post} /api/photos/tag Get photos by tag
 * @apiName GetPhotosByTag
 * @apiGroup Photos
 * 
 * @apiExample {json} Example request body:
 *    {tag: "pool"}
 * @apiDescription Gets photos by tag
 * @apiSuccessExample {json} Success response:
 *    [
 *      {
 *        tags: ['pool'],
 *        comments: [],
 *        _id: "9823745982374598237458",
 *        uploadedBy: {
 *          email: "test@test.com",
 *          name: "Tester"
 *        },
 *        uploadDate: "07/11/2018 11:30 am",
 *        __v: 0
 *      }
 *      ...
 *    ]
 */
router.post('/tag', ctrlPhotos.getPhotoByTag);

/**
 * @api {post} /api/photos/uploader/id Get photos by uploader ID
 * @apiName GetPhotosByUploaderId
 * @apiGroup Photos
 * 
 * @apiExample {json} Example request body:
 *    {id: 9823745982374598237458}
 * @apiDescription Gets photos uploaded by a user using their ID
 * @apiSuccessExample {json} Success response:
 *    [
 *      {
 *        tags: [],
 *        comments: [],
 *        _id: "9823745982374598237458",
 *        uploadedBy: {
 *          email: "test@test.com",
 *          name: "Tester"
 *        },
 *        uploadDate: "07/11/2018 11:30 am",
 *        __v: 0
 *      }
 *      ...
 *    ]
 */
router.post('/uploader/id', ctrlPhotos.getPhotoByUploaderId);

/**
 * @api {post} /api/photos/uploader/name Get photos by uploader name
 * @apiName GetPhotosByUploaderName
 * @apiGroup Photos
 * 
 * @apiExample {json} Example request body:
 *    {name: "Tester"}
 * @apiDescription Gets photos uploaded by a user using their name
 * @apiSuccessExample {json} Success response:
 *    [
 *      {
 *        tags: [],
 *        comments: [],
 *        _id: "9823745982374598237458",
 *        uploadedBy: {
 *          email: "test@test.com",
 *          name: "Tester"
 *        },
 *        uploadDate: "07/11/2018 11:30 am",
 *        __v: 0
 *      }
 *      ...
 *    ]
 */
router.post('/uploader/name', ctrlPhotos.getPhotoByUploaderName);

/**
 * @api {patch} /api/photos/tag/:id Change tags for photo
 * @apiName GetPhotosByUploaderId
 * @apiGroup Photos
 * 
 * @apiParam {Number} id ID of photo to edit tags for
 * @apiExample {json} Example request body:
 *    {tags: ["pool", "Red Sox"]}
 * @apiDescription Sets tags array for a photo
 * @apiSuccessExample {json} Success response:
 *    {
 *      tags: ["pool", "Red Sox"],
 *      comments: [],
 *      _id: "9823745982374598237458",
 *      uploadedBy: {
 *        email: "test@test.com",
 *        name: "Tester"
 *      },
 *      uploadDate: "07/11/2018 11:30 am",
 *      __v: 0
 *    }
 */
router.patch('/tag/:id', ctrlPhotos.editTags);

/**
 * @api {patch} /api/photos/comment/:id Add comment to photo
 * @apiName AddCommentToPhoto
 * @apiGroup Photos
 * 
 * @apiExample {json} Example request body:
 *    {comment: "This is a comment."}
 * @apiDescription Gets photos uploaded by a user using their name
 * @apiSuccessExample {json} Success response:
 *    {
 *      tags: [],
 *      comments: [{name: "Tester", content: "This is a comment."}],
 *      _id: "9823745982374598237458",
 *      uploadedBy: {
 *        email: "test@test.com",
 *        name: "Tester"
 *      },
 *      uploadDate: "07/11/2018 11:30 am",
 *      __v: 0
 *    }
 */
router.patch('/comment/:id', ctrlPhotos.editComments);

module.exports = router;
