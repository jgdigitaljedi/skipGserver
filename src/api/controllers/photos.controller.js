const logger = require('../config/winston');
const mongoose = require('mongoose');
const Photo = mongoose.model('Photo');
const User = mongoose.model('User');

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
	res.status(200).send('Download Photo Success');
};

module.exports.downloadAll = (req, res) => {
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
			const filter = req.tag.toLowerCase();
			const filtered = photos.filter((p) => {
				if (p.tags && p.tags.length) {
					return p.tags.indexOf(filter) >= 0;
				}
			});
			res.status(200).json(filtered);
		}
	});
};

module.exports.getPhotoByUploader = (req, res) => {
	Photo.find({}, (err, photos) => {
		if (err) {
			logger.logThis(err, req);
			res.status(500).send('ERROR: Error fetching photos from DB.');
		} else {
			const filter = req.uploader.toLowerCase();
			const filtered = photos.filter((p) => {
				if (p.uploader && p.uploader.length) {
					return p.uploader.indexOf(filter) >= 0;
				}
			});
			res.status(200).json(filtered);
		}
	});
};

module.exports.uploadPhotos = (req, res) => {
	// no comments on upload just to make this simpler
	console.log('here');
	const file = req.file;
	if (!file) {
		logger.logThis('ERROR: Photo file not received!', req);
		res.status(500).send('ERROR: Photo file not received!');
	} else {
		// @TODO: need to do 300px width conversion and save as thumb as well
		let photo = new Photo();
		photo.uploadedBy = req.payload._id;
		photo.timestamp();
		photo.fileName = file.filename;
		photo.tags = req.body.tags ? req.body.tags : [];
		photo.comments = [];
		photo.save((err) => {
			res.status(200).json(photo);
		});
	}
	// make tags and uploader lower case before save so they are easy to filter by later
};

module.exports.deletePhoto = (req, res) => {
	// must be admin to hit this
	res.status(200).send('Delete Photo Success');
};

module.exports.editTags = (req, res) => {
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
