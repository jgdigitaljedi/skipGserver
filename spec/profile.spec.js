const frisby = require('frisby');
const common = require('./common');

describe('Profile', function () {
	it('should fetch user info, verify it gets 3 keys back and that admin is false', function () {
		return global.login().then((res) => {
			const user = res.data;
			const headers = {
				Authorization: `Bearer ${user.token}`
			};
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
		})
			.catch((err) => {
				console.log('profile error', err);
			});
	});
});
