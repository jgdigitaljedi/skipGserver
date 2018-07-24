const multer = require('multer');
const common = require('../../../common');
const moment = require('moment');
const path = require('path');
const chalk = require('chalk');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const dest = path.join(common.rootPath + '/public/photos');
		cb(null, dest);
	},
	fileFilter: (req, file, cb) => {
		if (!file) {
			console.log(chalk.red('no file'));
			cb();
		}
		const image = file.mimetype.startsWith('image/');
		if (image) {
			cb(null, true);
		} else {
			console.log(chalk.red('no image'));
			return cb();
		}
	},
	filename: (req, file, cb) => {
		const ext = file.mimetype.split('/')[1];
		const photoName = file.fieldname + '-' + moment().format(common.photoDateFormat) + '.' + ext;
		cb(null, photoName);
	}
});

const upload = multer({ storage: storage });
module.exports = upload;
