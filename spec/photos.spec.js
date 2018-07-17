const frisby = require('frisby');
const Joi = frisby.Joi;
const common = require('./common');
const axios = require('axios');
const photosBase = `${common.baseUrl}photos`;
const _difference = require('lodash/difference');
// @TODO: figure out how to test upload, download, downlad all, and delete

function hasPhotoKeys(data) {
	const master = [ 'tags', 'comments', '_id', 'uploadedBy', 'uploadDate', 'fileName', '__v' ];
	return _difference(master, Object.keys(data)).length;
}

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
				expect(hasPhotoKeys(resJson)).toEqual(0);
			});
	});

	it('post#photos/tag searches for and returns photos using a tag', function() {
		return frisby
			.fetch(`${photosBase}/tag`, {
				method: 'POST',
				headers,
				body: JSON.stringify({ tag: 'test' })
			})
			.expect('status', 200)
			.then((response) => {
				const resJson = response.json;
				expect(response).toBeTruthy();
				expect(resJson.length).toBeGreaterThan(0);
				expect(resJson[0].tags.indexOf('test')).toBeGreaterThan(-1);
				expect(hasPhotoKeys(resJson[0])).toEqual(0);
			});
	});

	it('post#photos/uploader/id gets photos by uploader id', function() {});

	it('post#photos/uploadername gets photos by uploader name', function() {});

	it('patch#photos/tag/:id edits tags for photo with ID', function() {});

	it('patch#photos/comment/:id edits comments for photo with ID', function() {});

	it('post#photos uploads a new photo and returns the info', function() {});

	it('get#photos/all downloads a zip file with all photos', function() {});

	it('delete#photos/:id deletes a photo from storage and info from DB and returns deleted photo info', function() {});
});
