const frisby = require('frisby');
const common = require('./common');


describe('Profile', function () {
	let user;
	let headers;
	beforeAll((done) => {
		global.login()
			.then((res) => {
				user = res.data;
				headers = {
					Authorization: `Bearer ${user.token}`
				};
				done();
			})
			.catch((err) => {
				console.error('Profile beforeAll promise rejected', err);
			});
	});

	it('should fetch user info, verify it gets 3 keys back and that admin is false', function () {
		return frisby
			.fetch(`${common.baseUrl}profile`, {
				method: 'GET',
				headers
			})
			.expect('status', 200)
			.then((data) => {
				const parsed = JSON.parse(data.body);
				expect(Object.keys(parsed).length).toEqual(3);
				expect(parsed.admin).toBeFalsy();
			});
	});
});
