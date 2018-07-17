const frisby = require('frisby');
const common = require('./common');
const axios = require('axios');


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

	afterAll((done) => {
		axios.patch(`${common.baseUrl}profile`, { name: 'Tester McTesterson' }, { headers })
			.then((res) => {
				console.log('creds set back to original state!');
			})
			.catch((err) => {
				console.error('error resetting creds back to original state!', err);
			});
		done();
	});

	it('get#profile should fetch user info, verify it gets 3 keys back and that admin is false', function () {
		return frisby
			.fetch(`${common.baseUrl}profile`, {
				method: 'GET',
				headers
			})
			.expect('status', 200)
			.then((data) => {
				const parsed = JSON.parse(data.body);
				expect(Object.keys(parsed).length).toEqual(6);
				expect(parsed.admin).toBeFalsy();
			});
	});

	it('patch#profile should update a profile', function () {
		return frisby
			.fetch(`${common.baseUrl}profile`, {
				method: 'PATCH',
				headers,
				body: JSON.stringify({ lastName: 'McNamechange' })
			})
			.expect('status', 200)
			.then((data) => {
				const parsed = JSON.parse(data.body);
				expect(parsed.lastName).toEqual('McNamechange');
			});
	});
});
