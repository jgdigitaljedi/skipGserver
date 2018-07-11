var logger = require('../config/winston');
var mongoose = require('mongoose');
var Photo = mongoose.model('Photo');
var User = mongoose.model('User');

module.exports.getList = function (req, res) {
	Photo.find({})
		.populate('uploadedBy', '-_id -salt -hash -admin')
		.exec(function (err, photos) {
			if (err) {
				logger.logThis(err, req);
				res.status(500).send('ERROR: Error fetching photos list!');
			}
			res.status(200).json(photos);
		});;
};

module.exports.downloadPhoto = function (req, res) {
	res.status(200).send('Download Photo Success');
};

module.exports.downloadAll = function (req, res) {
	res.status(200).send('Download ALL Photos Success');
};

module.exports.getPhotoInfo = function (req, res) {
	if (req.params.hasOwnProperty('id') && req.params.id) {
		var id = req.params.id;
		console.log('id', id);
		Photo.findById(id, function (err, photo) {
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

module.exports.getPhotoByTag = function (req, res) {
	Photo.find({}, function (err, photos) {
		if (err) {
			logger.logThis(err, req);
			res.status(500).send('ERROR: Error fetching photos from DB.');
		} else {
			var filter = req.tag.toLowerCase();
			var filtered = photos.filter(function (p) {
				if (p.tags && p.tags.length) {
					return p.tags.indexOf(filter) >= 0;
				}
			});
			res.status(200).json(filtered);
		}
	});
};

module.exports.getPhotoByUploader = function (req, res) {
	Photo.find({}, function (err, photos) {
		if (err) {
			logger.logThis(err, req);
			res.status(500).send('ERROR: Error fetching photos from DB.');
		} else {
			var filter = req.uploader.toLowerCase();
			var filtered = photos.filter(function (p) {
				if (p.uploader && p.uploader.length) {
					return p.uploader.indexOf(filter) >= 0;
				}
			});
			res.status(200).json(filtered);
		}
	});
};

module.exports.uploadPhotos = function (req, res) {
	// no comments on upload just to make this simpler
	var file = req.file;
	var user = req.user;
	if (!file) {
		logger.logThis('ERROR: Photo file not received!', req);
		res.status(500).send('ERROR: Photo file not received!');
	} else {
		// @TODO: need to do 300px width conversion and save as thumb as well
		var photo = new Photo();
		// photo.getUploader(req.payload).then(function (user) {
		// 	photo.uploadedBy = user;
		// });
		photo.uploadedBy = req.payload._id;
		photo.timestamp();
		photo.fileName = file.filename;
		photo.tags = req.body.tags ? req.body.tags : [];
		photo.comments = [];
		console.log('photo', photo);
		photo.save(function (err) {
			res.status(200).json(photo);
		});
	}
	// make tags and uploader lower case before save so they are easy to filter by later
};

module.exports.deletePhoto = function (req, res) {
	// must be admin to hit this
	res.status(200).send('Delete Photo Success');
};

module.exports.editTags = function (req, res) {
	if (req.params.hasOwnProperty('id') && req.params.id) {
		Photo.findById(req.params.id, function (err, photo) {
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

module.exports.editComments = function (req, res) {
	if (req.params.hasOwnProperty('id') && req.params.id) {
		Photo.findById(req.params.id, function (err, photo) {
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
