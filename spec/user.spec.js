const frisby = require('frisby');
const common = require('./common');

describe('User', function() {
	it('should register a new user and get back a token', function() {
		return frisby
			.post(`${common.baseUrl}user/register`, common.fulllUserCreds)
			.expect('status', 200)
			.then((response) => {
				expect(response.body).toBeTruthy();
				const resParsed = JSON.parse(response.body);
				expect(Object.keys(resParsed).length).toEqual(2);
			});
	});
});
