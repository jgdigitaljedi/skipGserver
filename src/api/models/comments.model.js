const mongoose = require('mongoose');
const moment = require('moment');
const common = require('../../../common');
// @TODO: make uploadedBy and photo into refs
// not yet implemented, just stubbed

const commentSchema = new mongoose.Schema({
	dateAdded: {
		type: String,
		required: true
	},
	uploadedBy: {
		type: String,
		required: true
	},
	photo: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true
	}
});

commentSchema.methods.getUploader = function(payload) {
	this.uploadedBy = payload;
};

commentSchema.methods.timestamp = function(payload) {
	this.uploadDate = moment().format(common.dateFormat);
};

mongoose.model('Comment', commentSchema);
