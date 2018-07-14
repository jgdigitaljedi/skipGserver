const frisby = require('frisby');
const common = require('./common');

describe('Photos', function() {
	it('should fetch photos list', function() {
		frisby.get(`${common.baseUrl}photos`).expect('status', 200);
	});
});
