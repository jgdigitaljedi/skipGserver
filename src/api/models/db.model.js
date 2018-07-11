const mongoose = require('mongoose');
const logger = require('../config/winston');
let gracefulShutdown;
const dbURI = 'mongodb://localhost:27017/skipg';
if (process.env.NODE_ENV === 'production') {
	dbURI = process.env.SKIPG_URI;
}

mongoose.connect(dbURI, { useNewUrlParser: true });

// CONNECTION EVENTS
mongoose.connection.on('connected', () => {
	console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', (err) => {
	logger.logThis(err, 'on mongoose connect');
	console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', () => {
	console.log('Mongoose disconnected');
});

// CAPTURE APP TERMINATION / RESTART EVENTS
// To be called when process is restarted or terminated
gracefulShutdown = (msg, callback) => {
	mongoose.connection.close(() => {
		console.log('Mongoose disconnected through ' + msg);
		callback();
	});
};
// For nodemon restarts
process.once('SIGUSR2', () => {
	gracefulShutdown('nodemon restart', () => {
		process.kill(process.pid, 'SIGUSR2');
	});
});
// For app termination
process.on('SIGINT', () => {
	gracefulShutdown('app termination', () => {
		process.exit(0);
	});
});
// For Heroku app termination
process.on('SIGTERM', () => {
	gracefulShutdown('Heroku app termination', () => {
		process.exit(0);
	});
});

// BRING IN YOUR SCHEMAS & MODELS
require('./users.model');
require('./photos.model');
