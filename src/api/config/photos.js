const sharp = require('sharp');
const common = require('../../../common');
const logger = require('../config/winston');
const exec = require('child_process').exec;

module.exports.createThumb = function(file) {
	const nameSplit = file.filename.split('.');
	sharp(file.path)
		.resize(300)
		.toFile(`${common.rootPath}/public/thumbs/${nameSplit[0]}-thumb.${nameSplit[1]}`, (err, info) => {
			if (err) {
				logger.logThis(err, 'resizing photo');
			}
		});
};

module.exports.removeExif = function(file) {
	/* run this on server; must be installed to work:
		sudo apt-get install libimage-exiftool-perl
	*/
	let child = exec(
		`exiftool -overwrite_original -gps:all= -xmp:geotag= ${common.rootPath}/public/photos/${file.filename}`,
		(error, stdout, stderr) => {
			if (error) {
				logger.logThis(error, 'stripping exif data');
			}
			if (stderr) {
				logger.logThis(stderr, 'stripping exif data');
			}
		}
	);
	child.on('close', (status) => {
		console.log('closed', status);
	});
};
