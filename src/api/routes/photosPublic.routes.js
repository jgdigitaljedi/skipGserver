const express = require('express');
const router = express.Router();
const ctrlPublic = require('../controllers/photosPublic.controller');

/**
 * @api {get} /api/photospublic Get array of photos from DB
 * @apiName GetPhotos
 * @apiGroup PhotosPublic
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
 * @apiErrorExample {json} Error response:
 *    {error: <system error message>, message: 'ERROR: Error fetching photos list!'}
 */
router.get('/', ctrlPublic.getList);

/**
 * @api {get} /api/photospublic/:id Download photo file
 * @apiName DownloadPhoto
 * @apiGroup PhotosPublic
 * 
 * @apiExample {json} Example request body:
 *    {id: 893465708237465}
 * @apiDescription Downloads a photo
 * @apiErrorExample {json} Error response:
 *    {error: <system error message>, message: 'ERROR: Problem sending file.'}
 */
router.get('/:id', ctrlPublic.downloadPhoto);

module.exports = router;
