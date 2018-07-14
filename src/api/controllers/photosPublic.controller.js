const logger = require('../config/winston');
const mongoose = require('mongoose');
const Photo = mongoose.model('Photo');
const common = require('../../../common');

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
