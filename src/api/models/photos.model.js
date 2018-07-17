const mongoose = require('mongoose');
const moment = require('moment');
const common = require('../../../common');

const photoSchema = new mongoose.Schema({
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
	tags: [ { type: String } ],
	comments: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' } ]
});

photoSchema.methods.timestamp = function() {
	this.uploadDate = moment().format(common.dateFormat);
};

mongoose.model('Photo', photoSchema);
