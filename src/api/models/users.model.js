const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const common = require('../../../common');

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		unique: true,
		required: true
	},
	firstName: {
		type: String,
		required: true
	},
	active: {
		type: Boolean,
		required: true
	},
	lastName: String,
	admin: {
		type: Boolean,
		required: true
	},
	hash: String,
	salt: String,
	joinDate: String,
	lastUpdated: String,
	resetToken: String,
	resetTokenExpires: String
});

userSchema.methods.generateResetToken = function () {
	this.resetToken = crypto.randomBytes(20).toString('hex');
	this.resetTokenExpires = moment().add(2, 'hours');
};

userSchema.methods.setPassword = function (password) {
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.validPassword = function (password) {
	var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
	return this.hash === hash;
};

userSchema.methods.joinDateAdd = function () {
	this.joinDate = moment().format(common.dateFormat);
};

userSchema.methods.profileUpdated = function () {
	this.lastUpdated = moment().format(common.dateFormat);
};

userSchema.methods.generateJwt = function () {
	var expiry = new Date();
	expiry.setDate(expiry.getDate() + 7);

	return jwt.sign(
		{
			_id: this._id,
			email: this.email,
			firstName: this.firstName,
			lastName: this.lastName,
			admin: this.admin,
			exp: parseInt(expiry.getTime() / 1000)
		},
		process.env.SKIPGSECRET
	); // DO NOT KEEP YOUR SECRET IN THE CODE!
};
mongoose.model('User', userSchema);
