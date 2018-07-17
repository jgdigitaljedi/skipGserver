const frisby = require('frisby');
const common = require('./common');

/*no testing devUser route since it is only for dev purposes*/

describe('User', function () {
	it('post#user/register should register a new user and get back a token', function () {
		const uniqUser = Object.assign({}, common.fulllUserCreds);
		const emailSplit = uniqUser.email.split('@');
		uniqUser.email = emailSplit[0] + Math.floor(Math.random() * 300) + emailSplit[1];
		return frisby.post(`${common.baseUrl}user/register`, uniqUser).expect('status', 200).then((response) => {
			expect(response.body).toBeTruthy();
			const resParsed = JSON.parse(response.body);
			expect(Object.keys(resParsed).length).toEqual(6);
		});
	});

	it('post#user/login should login a user', function () {
		return frisby
			.post(`${common.baseUrl}user/login`, common.loginUserCreds)
			.expect('status', 200)
			.then((response) => {
				expect(response.body).toBeTruthy();
				const resParsed = JSON.parse(response.body);
				expect(Object.keys(resParsed).length).toEqual(6);
				expect(resParsed.admin).toBeFalsy();
			});
	});
});
