const frisby = require('frisby');
const common = require('./common');

describe('Profile', function() {
	it('should fetch user info', function() {
		return frisby.get(`${common.baseUrl}profile`).expect('status', 200);
	});
});
