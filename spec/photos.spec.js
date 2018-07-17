const frisby = require('frisby');
const Joi = frisby.Joi;
const common = require('./common');
const axios = require('axios');
const photosBase = `${common.baseUrl}photos`;

describe('Photos', function() {
	let user;
	let headers;
	let photos;
	beforeAll((done) => {
		global
			.login()
			.then((res) => {
				user = res.data;
				headers = {
					Authorization: `Bearer ${user.token}`
				};
				return axios
					.get(`${common.baseUrl}photospublic`)
					.then((response) => {
						photos = response.data;
						done();
					})
					.catch((error) => {
						console.error('Photos beforeAll error fetching photos list');
					});
			})
			.catch((err) => {
				console.error('Photos beforeAll promise rejected', err);
			});
	});

	it('get#photos/info/:id should get DB info for a photo', function() {
		return frisby
			.fetch(`${photosBase}/info/${photos[0]._id}`, {
				method: 'GET',
				headers
			})
			.expect('status', 200)
			.then((response) => {
				const resJson = response.json;
				expect(response).toBeTruthy();
				expect(Array.isArray(resJson.tags)).toBeTruthy();
				expect(typeof resJson.fileName).toEqual('string');
				expect(Array.isArray(resJson.comments)).toBeTruthy();
				expect(typeof resJson._id).toEqual('string');
			});
	});
});
