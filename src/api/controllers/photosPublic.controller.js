const logger = require('../config/winston');
const mongoose = require('mongoose');
const Photo = mongoose.model('Photo');
const common = require('../../../common');
const path = require('path');
const removeUserDetails = '-_id -salt -hash -admin -email -joinDate -lastUpdated -resetToken -resetTokenExpires';

/**
 * GET /photospublic
 * Returns an array of objects for uploaded photos
 * @param {*} req 
 * @param {*} res 
 */
module.exports.getList = (req, res) => {
	Photo.find({}).populate('uploadedBy', removeUserDetails).populate('comments.commenter', removeUserDetails).exec((err, photos) => {
		if (err) {
			logger.logThis(err, req);
			res.status(500).json({ error: err, message: 'ERROR: Error fetching photos list!' });
		}
		res.status(200).json({ error: false, photos });
	});
};

/**
 * GET /photospublic/:id
 * Downloads a photo using photo ID
 * @param {*} req 
 * @param {*} res 
 */
module.exports.downloadPhoto = (req, res) => {
	if (req.params.id) {
		try {
			Photo.findById(req.params.id, function (err, photo) {
				if (err) {
					logger.logThis(err, req);
					res.status(500).json({ error: err, message: 'ERROR: Problem fetching photo info.' });
				} else {
					const filePath = path.join(common.rootPath, `public/photos/${photo.fileName}`);
					res.download(filePath);
				}
			});
		} catch (e) {
			logger.logThis(e, req);
			res.status(500).json({ error: e, message: 'ERROR: Problem sending file.' });
		}
	} else {
		logger.logThis('no file name sent', req);
		res.status(400).json({ error: true, message: 'ERROR: No photo ID sent in params.' });
	}
};
