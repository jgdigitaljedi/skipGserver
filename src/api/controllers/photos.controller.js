const logger = require('../config/winston');
const mongoose = require('mongoose');
const Photo = mongoose.model('Photo');
const photoFix = require('../config/photos');
const fs = require('fs');
const common = require('../../../common');
const moment = require('moment');
const bluebird = require('bluebird');
const archive = require('../config/archive');
const path = require('path');

function deleteFile(file) {
	return new Promise((resolve, reject) => {
		fs.unlink(file, (err) => {
			if (err) {
				reject({ success: false, error: err });
			} else {
				resolve({ success: true });
			}
		});
	});
}

/**
 * GET /photos/all
 * Downloads zip file containing all photos
 * @param {*} req 
 * @param {*} res 
 */
module.exports.downloadAll = (req, res) => {
	try {
		res.download(path.join(common.rootPath, 'public/Skipg.zip'));
	} catch (e) {
		logger.logThis(e, req);
		res.status(500).json({ error: e, message: 'ERROR: Problem sending zip file.' });
	}
};

/**
 * GET /photos/info/:id
 * Gets DB info for a photo by given ID and returns it
 * @param {*} req 
 * @param {*} res 
 */
module.exports.getPhotoInfo = (req, res) => {
	if (req.params.hasOwnProperty('id') && req.params.id) {
		const id = req.params.id;
		Photo.findById(id).populate('uploadedBy', '-_id -salt -hash -admin').exec((err, photo) => {
			if (err) {
				logger.logThis(err, req);
				res.status(500).json({ error: err, message: 'ERROR: Error fetching photo info!' });
			} else {
				res.status(200).json(photo);
			}
		});
	} else {
		logger.logThis('no id sent', req);
		req.status(400).json({ error: true, message: 'ERROR: No id sent in request params!' });
	}
};

/**
 * POST /photos/tag
 * Takes tag string, searches tags of all photos, and returns array of photos
 * req.body.tag
 * @param {*} req 
 * @param {*} res 
 */
module.exports.getPhotoByTag = (req, res) => {
	Photo.find({}).populate('uploadedBy', '-_id -salt -hash -admin').exec((err, photos) => {
		if (err) {
			logger.logThis(err, req);
			res.status(500).json({ error: err, message: 'ERROR: Error fetching photos from DB.' });
		} else {
			if (req.body.tag) {
				try {
					const filterTag = req.body.tag.toLowerCase();
					const filtered = photos.filter((p) => {
						if (p.tags && p.tags.length) {
							return (
								p.tags.filter((t) => {
									return t.indexOf(filterTag) >= 0;
								}).length > 0
							);
						}
					});
					res.status(200).json(filtered);
				} catch (e) {
					logger.logThis(e, req);
					res.status(500).json({ error: e, message: 'ERROR: Problem parsing photos data.' });
				}
			} else {
				res.status(400).json({ error: true, message: 'ERROR: No tag(s) were sent.' });
			}
		}
	});
};

/**
 * POST /photos/uploader/:id
 * Takes uploader id and returns array of photos they have uploaded
 * req.body.uploader
 * @param {*} req 
 * @param {*} res 
 */
module.exports.getPhotoByUploaderId = (req, res) => {
	Photo.find({}).populate('uploadedBy', '-_id -salt -hash -admin').exec((err, photos) => {
		if (err) {
			logger.logThis(err, req);
			res.status(500).json({ error: err, message: 'ERROR: Error fetching photos from DB.' });
		} else {
			if (req.body.uploader) {
				try {
					const filtered = photos.filter((p) => p.uploadedBy === req.body.uploader);
					res.status(200).json(filtered);
				} catch (e) {
					logger.logThis(e, req);
					res.status(500).json({ error: e, message: 'ERROR: Problem parsing photos by uploader id.' });
				}
			} else {
				res.status(400).json({ error: true, message: 'ERROR: No uploader value sent in request!' });
			}
		}
	});
};

/**
 * POST /photos/uploader/name
 * Takes uploader name and returns array of photos with uploader name that matches (could be more than 1 person if same name)
 * req.body.uploader
 * @param {*} req 
 * @param {*} res 
 */
module.exports.getPhotoByUploaderName = (req, res) => {
	Photo.find({}).populate('uploadedBy', '-_id -salt -hash -admin').exec((err, photos) => {
		if (err) {
			logger.logThis(err, req);
			res.status(500).json({ error: err, message: 'ERROR: Error fetching photos from DB.' });
		} else {
			if (req.body.uploader) {
				try {
					const filterText = req.body.uploader.toLowerCase();
					const filtered = photos.filter((p) => {
						if (p.uploadedBy && p.uploadedBy.firstName) {
							return (
								p.uploadedBy.firstName.indexOf(filterText) >= 0 ||
								(p.uploadedBy.hasOwnProperty('lastName') &&
									p.uploadedBy.lastName.indexOf(filterText) >= 0)
							);
						}
					});
					res.status(200).json(filtered);
				} catch (e) {
					logger.logThis(e, req);
					res.status(500).json({ error: e, message: 'ERROR: Problem parsing photos by uploader name.' });
				}
			} else {
				res.status(200).json([]);
			}
		}
	});
};

/**
 * POST /photos
 * Uploads a photo, creates a thumbnail, strips geo exif data, saves info to DB, and returns info to caller
 * req.file
 * @param {*} req 
 * @param {*} res 
 */
module.exports.uploadPhotos = (req, res) => {
	// no comments on upload just to make this simpler
	const file = req.file;
	if (!file) {
		logger.logThis('ERROR: Photo file not received!', req);
		res.status(500).json({ error: 'upload not received', message: 'ERROR: Photo file not received!' });
	} else {
		try {
			const promiseArr = [photoFix.removeExif, photoFix.createThumb];
			// remove geo tag data
			bluebird
				.map(promiseArr, (step) => {
					return step(req.file);
				})
				.then((result) => {
					let photo = new Photo();
					photo.fillDetails(result);
					photo.timestamp();
					photo.uploadedBy = req.payload._id;
					photo.fileName = file.filename;
					if (req.body.tags) {
						// convert tags to lower case for easier use later
						photo.tags = req.body.tags.map((tag) => tag.toLowerCase());
					} else {
						photo.tags = [];
					}
					photo.comments = [];
					photo.save((err) => {
						if (err) {
							logger.logThis(err, req);
							res.status(500).json({ error: err, message: 'ERROR: Problem saving photo.' });
						} else {
							archive.makeZip();
							res.status(200).json(photo);
						}
					});
				})
				.catch((error) => {
					console.log('error', error);
					logger.logThis(error, req);
					req.status(500).json({
						error,
						message: 'ERROR: Something went wrong with either creating thumbnail or removing exif data.'
					});
				});
		} catch (e) {
			logger.logThis(e, req);
			res.status(500).json({ error: e, message: 'ERROR: An error occurred with the photo upload process.' });
		}
	}
};

/**
 * DELETE /photos/:id
 * Takes photo ID and deletes photo, thumbnail, and DB entry
 * MUST BE ADMIN TO USE THIS
 * @param {*} req 
 * @param {*} res 
 */
module.exports.deletePhoto = (req, res) => {
	// must be admin to hit this
	if (req.payload && req.payload.admin) {
		Photo.findById(req.params.id, (err, photo) => {
			if (err) {
				logger.logThis(err, req);
				res.status(500).json({ error: err, message: 'ERROR: Problem fetching photo for deletion.' });
			} else {
				const filePath = `${common.rootPath}/public/photos/${photo.fileName}`;
				// delete db entry
				photo.remove((error) => {
					if (error) {
						logger.logThis(error, req);
						res.status(500).json({ error, message: 'ERROR: Problem deleting DB entry for photo.' });
					} else {
						const nameSplit = photo.fileName.split('.');
						// delete photo
						deleteFile(filePath)
							.then(() => {
								const thumbPath = `${common.rootPath}/public/thumbs/${nameSplit[0]}-thumb.${nameSplit[1]}`;
								// delete thumb
								deleteFile(thumbPath)
									.then(() => {
										res.status(200).json(photo);
									})
									.catch((e) => {
										logger.logThis(e, req);
										res
											.status(500)
											.json({ error: e, message: 'ERROR: Problem deleting thumbnail.' });
									});
							})
							.catch((er) => {
								logger.logThis(er, req);
								res.status(500).json({ error: er, message: 'ERROR: Problem deleting photo.' });
							});
					}
				});
			}
		});
	} else {
		res.status(403).send({ error: true, message: 'UNAUTHORIZED: You must be an admin to delete a photo!' });
	}
};

/**
 * PATCH photos.tag/:id
 * Takes photo ID in params and array of tags and sets photo tags to new array of tags
 * req.body.tags (array of tags containing ALL tags so add or delete requests need to send entire array of new tags)
 * @param {*} req 
 * @param {*} res 
 */
module.exports.editTags = (req, res) => {
	if (req.params.hasOwnProperty('id') && req.params.id) {
		if (req.body.tags) {
			try {
				const tags = req.body.tags.map((tag) => tag.toLowerCase());
				Photo.findOneAndUpdate(
					{ _id: req.params.id },
					{ $set: { tags: tags } },
					{ new: true },
					(err, photo) => {
						if (err) {
							logger.logThis(err, req);
							res
								.status(500)
								.json({ error: err, message: 'ERROR: Problem fetching photo from DB to edit tags.' });
						} else {
							res.status(200).json(photo);
						}
					}
				);
			} catch (e) {
				logger.logThis(e, req);
				res.status(500).json({ error: e, message: 'ERROR: Problem with updating tags.' });
			}
		}
	} else {
		logger.logThis('no id sent', req);
		req.status(400).json({ error: true, message: 'ERROR: No id sent in request params!' });
	}
};

/**
 * PATCH /photos/comment/:id
 * Takes photo ID param and comment string and adds the comment to the photo's comment array
 * req.body.comment
 * @param {*} req 
 * @param {*} res 
 */
module.exports.editComments = (req, res) => {
	if (req.params.hasOwnProperty('id') && req.params.id) {
		if (req.body.comment && req.body.comment.length) {
			try {
				Photo.findById(req.params.id, (err, photo) => {
					if (err) {
						logger.logThis(err, req);
						res.status(500).json({ error: err, message: 'ERROR: Problem getting photo to add comments.' });
					} else {
						photo.comments.push({
							commenter: req.payload._id,
							date: moment().format(common.dateFormat),
							content: req.body.comment
						});
						photo.save((er) => {
							if (er) {
								logger.logThis(er, req);
								res.status(500).json({ error: er, message: 'ERROR: Problem saving comment.' });
							} else {
								res.status(200).json(photo);
							}
						});
					}
				});
			} catch (e) {
				logger.logThis(e, req);
				res.status(500).json({ error: e, message: 'ERROR: Problem with saving comment.' });
			}
		} else {
			logger.logThis('no comment sent', req);
			res.status(400).json({ error: true, message: 'ERROR: No comment sent in request' });
		}
	} else {
		logger.logThis('no id sent', req);
		req.status(400).json({ error: true, message: 'ERROR: No id sent in request params!' });
	}
};
