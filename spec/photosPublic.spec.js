const frisby = require('frisby');
const Joi = frisby.Joi;
const common = require('./common');

describe('PhotosPublic', function () {
	it('get#photos should fetch photos list, have a 200 status, and return an array of objects', function () {
		return frisby.get(`${common.baseUrl}photospublic`).expect('status', 200).then((response) => {
			expect(response.body).toBeTruthy();
			const resArr = JSON.parse(response.body);
			expect(Array.isArray(resArr)).toBeTruthy();
		});
	});
});
