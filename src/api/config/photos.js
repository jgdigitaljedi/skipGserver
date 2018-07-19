const sharp = require('sharp');
const common = require('../../../common');
const logger = require('../config/winston');
const exec = require('child_process').exec;

module.exports.createThumb = function (file) {
	return new Promise((resolve, reject) => {
		const nameSplit = file.filename.split('.');
		sharp(file.path)
			.resize(300)
			.toFile(`${common.rootPath}/public/thumbs/${nameSplit[0]}-thumb.${nameSplit[1]}`, (err, info) => {
				if (err) {
					logger.logThis(err, 'resizing photo');
					reject(err);
				} else {
					resolve(info);
				}
			});
	});
};

module.exports.removeExif = function (file) {
	/* run this on server; must be installed to work:
		sudo apt-get install libimage-exiftool-perl
	*/
	return new Promise((resolve, reject) => {
		let child = exec(
			`exiftool -overwrite_original -gps:all= -xmp:geotag= ${common.rootPath}/public/photos/${file.filename}`,
			(error, stdout, stderr) => {
				if (error) {
					logger.logThis(error, 'stripping exif data');
					reject(error);
				}
				if (stderr) {
					logger.logThis(stderr, 'stripping exif data');
					reject(stderr);
				}
			}
		);
		child.on('close', (status) => {
			resolve(status);
		});
	});
};
