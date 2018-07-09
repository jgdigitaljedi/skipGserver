var mongoose = require('mongoose');
var moment = require('moment');

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
		type: String,
		required: true
	},
	tags: [ { type: String } ],
	comments: [ { type: String } ]
});

photoSchema.methods.getUploader = function(payload) {
	this.uploadedBy = payload.name;
};

photoSchema.methods.timestamp = function(payload) {
	this.uploadDate = moment().format('MM/DD/YYYY h:mm a');
};

mongoose.model('Photo', photoSchema);
