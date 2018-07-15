const frisby = require('frisby');
const common = require('./common');

let user;
let headers;

beforeAll(function() {
	frisby.post(`${common.baseUrl}user/login`, common.loginUserCreds).then((response) => {
		console.log('response', response.body);
		user = JSON.parse(response.body);
		headers = {
			Authorization: `Bearer ${user.token}`
		};
	});
});

describe('Profile', function() {
	it('should fetch user info', function() {
		console.log('headers', headers);
		return frisby
			.fetch(`${common.baseUrl}profile`, {
				method: 'GET',
				headers
			})
			.expect('status', 200);
	});
});
