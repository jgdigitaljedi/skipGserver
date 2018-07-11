var mongoose = require('mongoose');
var moment = require('moment');
var common = require('../../../common');
// var User = mongoose.model('User');

// function findUser(id) {
// 	return User.findById(id).exec();
// }

var photoSchema = new mongoose.Schema({
	uploadDate: {
		type: String,
		required: true
	},
	fileName: {
		type: String,
		required: true
	},
	uploadedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	tags: [{ type: String }],
	comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

photoSchema.methods.getUploader = function (payload) {
	this.uploadedBy = payload._id;
};

photoSchema.methods.timestamp = function (payload) {
	this.uploadDate = moment().format(common.dateFormat);
};

mongoose.model('Photo', photoSchema);
