const sharp = require('sharp');
const common = require('../../../common');
const logger = require('../config/winston');

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
