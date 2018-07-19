const fs = require('fs');
const archiver = require('archiver');
const common = require('../../../common');
const path = require('path');
const logger = require('./winston');

// @TODO: hook this up and test; this is mostly a copy pasta job from the github page for archiver at the moment
module.exports.makeZip = function () {
	const destPath = path.join(common.rootPath, 'public/Skipg');
	const sourcePath = path.join(common.rootPath, 'public/photos');
	var output = fs.createWriteStream(destPath + '.zip');
	var archive = archiver('zip', {
		zlib: { level: 9 } // Sets the compression level.
	});

	// listen for all archive data to be written
	// 'close' event is fired only when a file descriptor is involved
	output.on('close', () => {
		logger.logInfo(`ZIP FILE STREAM CLOSED: ${archive.pointer()} total bytes`);
	});

	// This event is fired when the data source is drained no matter what was the data source.
	// It is not part of this library but rather from the NodeJS Stream API.
	// @see: https://nodejs.org/api/stream.html#stream_event_end
	output.on('end', () => {
		logger.logInfo('ZIP DATA DRAINED');
	});

	// good practice to catch warnings (ie stat failures and other non-blocking errors)
	archive.on('warning', (err) => {
		if (err.code === 'ENOENT') {
			// log warning
			logger.logWarning('WARNING creating archive: ' + err);
		} else {
			// log error
			logger.logThis(err, 'ERROR creating archive.');
		}
	});

	// good practice to catch this error explicitly
	archive.on('error', (err) => {
		logger.logThis(err, 'ERROR creating archive.');
	});

	// pipe archive data to the file
	archive.pipe(output);

	// append files from a glob pattern
	archive.glob('*.*', { cwd: sourcePath });

	// finalize the archive (ie we are done appending files but streams have to finish yet)
	// 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
	archive.finalize();
};
