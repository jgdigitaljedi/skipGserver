const frisby = require('frisby');
const common = require('./common');

describe('User', function() {
	it('should register a new user and get back a token', function() {
		frisby.post(`${common.baseUrl}user/register`, common.fulllUserCreds).expect('status', 200);
	});
});
