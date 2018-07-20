const frisby = require('frisby');
const common = require('./common');

describe('Admin', function() {
	let user;
	let headers;
	let admin;
	let adminHeaders;
	beforeAll((done) => {
		global
			.login()
			.then((res) => {
				user = res.data;
				headers = {
					Authorization: `Bearer ${user.token}`
				};
				global
					.adminLogin()
					.then((res) => {
						admin = res.data;
						adminHeaders = {
							Authorization: `Bearer ${admin.token}`
						};
						done();
					})
					.catch((error) => {
						console.error('Admin beforeAll admin promise rejected', error);
					});
			})
			.catch((err) => {
				console.error('Admin beforeAll user promise rejected', err);
			});
	});

	it('get#admin/listusers should fail when request not made from admin', function() {
		return frisby
			.fetch(`${common.baseUrl}admin/listusers`, {
				method: 'GET',
				headers
			})
			.expect('status', 403);
	});
});
