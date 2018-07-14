const frisby = require('frisby');
const common = require('./common');

describe('Admin', function() {
	it('should fetch users list', function() {
		return frisby.get(`${common.baseUrl}listusers`).expect('status', 200);
	});
});
