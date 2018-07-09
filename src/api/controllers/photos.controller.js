var logger = require('../config/winston');
var mongoose = require('mongoose');
var Photo = mongoose.model('Photo');

module.exports.getList = function(req, res) {
	res.status(200).send('Get List Success');
};

module.exports.getPhotoInfo = function(req, res) {
	res.status(200).send('Upload Photos Success');
};

module.exports.getPhotoByTag = function(req, res) {
	res.status(200).send('Get Photo by Tag Success');
};

module.exports.getPhotoByUploader = function(req, res) {
	res.status(200).send('Get Photo by Uploader Success');
};

module.exports.uploadPhotos = function(req, res) {
	res.status(200).send('Upload Photos Success');
};

module.exports.deletePhoto = function(req, res) {
	// must be admin to hit this
	res.status(200).send('Delete Photo Success');
};

module.exports.editTags = function(req, res) {
	// should take action for add or delete
	// should take tags array
	res.status(200).send('Add Tags Success');
};

module.exports.editComments = function(req, res) {
	// should take action for add or delete
	// should take comment string
	res.status(200).send('Add Comment Success');
};
