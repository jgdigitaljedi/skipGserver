const frisby = require('frisby');
const common = require('./common');

/*no testing devUser route since it is only for dev purposes*/

describe('User', function() {
	it('post#user/register should register a new user and get back a token', function() {
		return frisby
			.post(`${common.baseUrl}user/register`, common.fulllUserCreds)
			.expect('status', 200)
			.then((response) => {
				expect(response.body).toBeTruthy();
				const resParsed = JSON.parse(response.body);
				expect(Object.keys(resParsed).length).toEqual(2);
			});
	});

	it('post#user/login should login a user', function() {
		return frisby
			.post(`${common.baseUrl}user/login`, common.loginUserCreds)
			.expect('status', 200)
			.then((response) => {
				expect(response.body).toBeTruthy();
				const resParsed = JSON.parse(response.body);
				expect(Object.keys(resParsed).length).toEqual(2);
				expect(resParsed.admin).toBeFalsy();
			});
	});
});
