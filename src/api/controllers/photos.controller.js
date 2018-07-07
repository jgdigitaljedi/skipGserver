module.exports.getList = function(req, res) {
	res.status(200).send('Get List Success');
};

module.exports.uploadPhotos = function(req, res) {
	res.status(200).send('Upload Photos Success');
};

module.exports.deletePhoto = function(req, res) {
	// must be admin to hit this
	res.status(200).send('Delete Photo Success');
};
