const frisby = require('frisby');
const Joi = frisby.Joi;
const common = require('./common');

describe('Photos', function() {
	it('should fetch photos list, have a 200 status, and have json headers', function() {
		return frisby
			.get(`${common.baseUrl}photos`)
			.expect('status', 200)
			.expect('header', 'Content-Type', 'application/json')
			.expect('jsonTypes', '*', {
				_id: Joi.number()
			});
	});
});
