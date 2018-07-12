const logger = require('../config/winston');
const mongoose = require('mongoose');
const Photo = mongoose.model('Photo');
const photoFix = require('../config/photos');

module.exports.getList = (req, res) => {
	Photo.find({}).populate('uploadedBy', '-_id -salt -hash -admin').exec((err, photos) => {
		if (err) {
			logger.logThis(err, req);
			res.status(500).send('ERROR: Error fetching photos list!');
		}
		res.status(200).json(photos);
	});
};

module.exports.downloadPhoto = (req, res) => {
	// @TODO: write this
	res.status(200).send('Download Photo Success');
};

module.exports.downloadAll = (req, res) => {
	// @TODO: write this
	res.status(200).send('Download ALL Photos Success');
};

module.exports.getPhotoInfo = (req, res) => {
	if (req.params.hasOwnProperty('id') && req.params.id) {
		const id = req.params.id;
		Photo.findById(id, (err, photo) => {
			if (err) {
				logger.logThis(err, req);
				res.status(500).send('ERROR: Error fetching photo info!');
			} else {
				res.status(200).json(photo);
			}
		});
	} else {
		logger.logThis('no id sent', req);
		req.status(400).send('ERROR: No id sent in request params!');
	}
};

module.exports.getPhotoByTag = (req, res) => {
	Photo.find({}, (err, photos) => {
		if (err) {
			logger.logThis(err, req);
			res.status(500).send('ERROR: Error fetching photos from DB.');
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
					res.status(500).send('ERROR: Problem parsing photos data.');
				}
			} else {
				res.status(200).json([]);
			}
		}
	});
};

module.exports.getPhotoByUploaderId = (req, res) => {
	Photo.find({}, (err, photos) => {
		if (err) {
			logger.logThis(err, req);
			res.status(500).send('ERROR: Error fetching photos from DB.');
		} else {
			if (req.body.uploader) {
				try {
					const filtered = photos.filter((p) => p.uploadedBy === req.body.uploader);
					res.status(200).json(filtered);
				} catch (e) {
					logger.logThis(e, req);
					res.status(500).send('ERROR: Problem parsing photos by tags.');
				}
			} else {
				res.status(200).json([]);
			}
		}
	});
};

module.exports.getPhotoByUploaderName = (req, res) => {
	Photo.find({}, (err, photos) => {
		if (err) {
			logger.logThis(err, req);
			res.status(500).send('ERROR: Error fetching photos from DB.');
		} else {
			if (req.body.uploader) {
				try {
					const filterText = req.body.uploader.toLowerCase();
					const filtered = photos.filter((p) => {
						if (p.uploader && p.uploader.name) {
							return p.uploader.name.indexOf(filterText) >= 0;
						}
					});
					res.status(200).json(filtered);
				} catch (e) {
					logger.logThis(e, req);
					res.status(500).send('ERROR: Problem parsing photos by uploader name');
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
		res.status(500).send('ERROR: Photo file not received!');
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
			res.status(500).send('ERROR: An error occurred with the photo upload process.');
		}
	}
};

module.exports.deletePhoto = (req, res) => {
	// must be admin to hit this
	// @TODO: write this
	res.status(200).send('Delete Photo Success');
};

module.exports.editTags = (req, res) => {
	// @TODO: write this
	if (req.params.hasOwnProperty('id') && req.params.id) {
		Photo.findById(req.params.id, (err, photo) => {
			// assign new tags to photo and save, then send response
			res.status(200).send('Add Tags Success');
		});
	} else {
		logger.logThis('no id sent', req);
		req.status(400).send('ERROR: No id sent in request params!');
	}
	// should take action for add or delete
	// should take tags array
};

module.exports.editComments = (req, res) => {
	// @TODO: write this
	if (req.params.hasOwnProperty('id') && req.params.id) {
		Photo.findById(req.params.id, (err, photo) => {
			// assign new comments to photo and save, then send response
			res.status(200).send('Add Comment Success');
		});
	} else {
		logger.logThis('no id sent', req);
		req.status(400).send('ERROR: No id sent in request params!');
	}
	// should take action for add or delete
	// should take tags array
};
