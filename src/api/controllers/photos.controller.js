const logger = require('../config/winston');
const mongoose = require('mongoose');
const Photo = mongoose.model('Photo');
const photoFix = require('../config/photos');
const fs = require('fs');
const common = require('../../../common');

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

module.exports.getList = (req, res) => {
	Photo.find({}).populate('uploadedBy', '-_id -salt -hash -admin').exec((err, photos) => {
		if (err) {
			logger.logThis(err, req);
			res.status(500).json({ error: err, message: 'ERROR: Error fetching photos list!' });
		}
		res.status(200).json(photos);
	});
};

module.exports.downloadPhoto = (req, res) => {
	if (req.body.fileName) {
		try {
			res.download(common.rootPath, req.body.fileName);
		} catch (e) {
			logger.logThis(e, req);
			res.status(500).json({ error: e, message: 'ERROR: Problem sending file.' });
		}
	} else {
		logger.logThis('no file name sent', req);
		res.status(400).json({ error: true, message: 'ERROR: No photo file name in request body.' });
	}
};

module.exports.downloadAll = (req, res) => {
	// @TODO: write this
	res.status(200).send('Download ALL Photos Success');
};

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

module.exports.getPhotoByTag = (req, res) => {
	Photo.find({}).populate('uploadedBy', '-_id -salt -hash -admin').exec((err, photos) => {
		if (err) {
			logger.logThis(err, req);
			res.status(500).json({ error: err, message: 'ERROR: Error fetching photos from DB.' });
		} else {
			if (req.body.tag) {
				try {
					const filter = req.body.tag.toLowerCase();
					const filtered = photos.filter((p) => {
						if (p.tags && p.tags.length) {
							return p.tags.indexOf(filter) >= 0;
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
					res.status(500).json({ error: e, message: 'ERROR: Problem parsing photos by tags.' });
				}
			} else {
				res.status(400).json({ error: true, message: 'ERROR: No uploader value sent in request!' });
			}
		}
	});
};

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
						if (p.uploadedBy && p.uploadedBy.name) {
							return p.uploadedBy.name.indexOf(filterText) >= 0;
						}
					});
					res.status(200).json(filtered);
				} catch (e) {
					logger.logThis(e, req);
					res.status(500).json({ error: e, message: 'ERROR: Problem parsing photos by uploader name' });
				}
			} else {
				res.status(200).json([]);
			}
		}
	});
};

module.exports.uploadPhotos = (req, res) => {
	// @TODO: consider making thumb creation and exif stripping async and mandatory for success
	// no comments on upload just to make this simpler
	const file = req.file;
	if (!file) {
		logger.logThis('ERROR: Photo file not received!', req);
		res.status(500).json({ error: err, message: 'ERROR: Photo file not received!' });
	} else {
		try {
			// remove geo tag data
			photoFix.removeExif(req.file);
			// create thumb for view photos page
			photoFix.createThumb(req.file);
			// create and save photo info to db
			let photo = new Photo();
			photo.uploadedBy = req.payload._id;
			photo.timestamp();
			photo.fileName = file.filename;
			if (req.body.tags) {
				// convert tags to lwoer case for easier use later
				photo.tags = req.body.tags.map((tag) => tag.toLowerCase());
			} else {
				photo.tags = [];
			}
			photo.comments = [];
			photo.save((err) => {
				res.status(200).json(photo);
			});
		} catch (e) {
			logger.logThis(e, req);
			res.status(500).json({ error: e, message: 'ERROR: An error occurred with the photo upload process.' });
		}
	}
};

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
							name: req.payload.name,
							date: moment().format(common.dateFormat),
							content: req.body.comment
						});
						photo.save();
						res.status(200).json(photo);
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
