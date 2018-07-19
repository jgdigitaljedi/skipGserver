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
	tags: [{ type: String }],
	comments: [{
		commenter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		content: String,
		date: String
	}],
	details: {
		width: { type: Number },
		height: { type: Number },
		exifRemoved: { type: Boolean },
		format: { type: String },
		size: { type: Number }
	}
});

photoSchema.methods.timestamp = function () {
	this.uploadDate = moment().format(common.dateFormat);
};

photoSchema.methods.fillDetails = function (data) {
	const exifRemoved = data[0] === 0;
	const pDetails = data[1];
	this.details = {
		exifRemoved,
		width: pDetails.width,
		height: pDetails.height,
		format: pDetails.format,
		size: pDetails.size
	};
};

mongoose.model('Photo', photoSchema);
