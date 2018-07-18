const frisby = require('frisby');
const common = require('./common');
const axios = require('axios');
const photosBase = `${common.baseUrl}photos`;
const _difference = require('lodash/difference');
const _cloneDeep = require('lodash/cloneDeep');
const fs = require('fs');
const appCommon = require('../common');
const path = require('path');
// @TODO: figure out how to test upload, download, downlad all, and delete

function hasPhotoKeys(data) {
	const master = ['tags', 'comments', '_id', 'uploadedBy', 'uploadDate', 'fileName', '__v'];
	return _difference(master, Object.keys(data)).length;
}

describe('Photos', function () {
	console.warn('NOTE: If you do not have at least 1 photo in public/photos and 1 in the DB then you will have failures!');
	let user;
	let headers;
	let photos;
	let headersForm;
	let photo;
	beforeAll((done) => {
		global
			.login()
			.then((res) => {
				user = res.data;
				headers = {
					'Authorization': `Bearer ${user.token}`
				};
				headersForm = _cloneDeep(headers);
				headersForm['Content-Type'] = 'multipart/form-data';
				return axios
					.get(`${common.baseUrl}photospublic`)
					.then((response) => {
						photos = response.data;
						photo = fs.createReadStream(path.join(appCommon.rootPath, `public/photos/${photos[photos.length - 1].fileName}`));
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

	it('get#photos/info/:id should get DB info for a photo', function () {
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

	it('post#photos/tag searches for and returns photos using a tag', function () {
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

	it('post#photos/uploader/id gets photos by uploader id', function () {
		return frisby
			.fetch(`${photosBase}/uploader/id`, {
				method: 'POST',
				headers,
				body: JSON.stringify({ uploader: 10 })
			})
			.expect('status', 200)
			.then((response) => {
				const resJson = response.json;
				// we didn't send a real user id so it will return an empty array
				expect(Array.isArray(resJson)).toBeTruthy();
				expect(resJson.length).toBeFalsy();
			});
	});

	it('post#photos/uploader/name gets photos by uploader name', function () {
		return frisby
			.fetch(`${photosBase}/uploader/name`, {
				method: 'POST',
				headers,
				body: JSON.stringify({ uploader: 'Tester' })
			})
			.expect('status', 200)
			.then((response) => {
				const resJson = response.json;
				expect(Array.isArray(resJson)).toBeTruthy();
			});
	});

	it('patch#photos/tag/:id edits tags for photo with ID', function () {
		return frisby
			.fetch(`${photosBase}/tag/${photos[0]._id}`, {
				method: 'PATCH',
				headers,
				body: JSON.stringify({ tags: ['testing tests'] })
			})
			.expect('status', 200)
			.then((response) => {
				const resJson = response.json;
				expect(resJson.tags.indexOf('testing tests')).toBeGreaterThan(-1);
				expect(hasPhotoKeys(resJson)).toEqual(0);
			});
	});

	it('patch#photos/comment/:id edits comments for photo with ID', function () {
		return frisby
			.fetch(`${photosBase}/comment/${photos[0]._id}`, {
				method: 'PATCH',
				headers,
				body: JSON.stringify({ comment: 'Testing the testing process.' })
			})
			.expect('status', 200)
			.then((response) => {
				const resJson = response.json;
				expect(hasPhotoKeys(resJson)).toEqual(0);
				const commentContent = resJson.comments.map(c => c.content);
				expect(commentContent.indexOf('Testing the testing process.')).toBeGreaterThan(-1);
			});
	});

	it('post#photos uploads a new photo and returns the info', function () {
		let form = frisby.formData();
		form.append('file', photo);
		return frisby
			.setup({
				request: {
					headers: headersForm
				}
			})
			.post(photosBase, {
				body: {
					photo: form,
					tags: ['testing the upload from tests']
				}
			})
			.expect('status', 200)
			.then((response) => {
				const resJson = response.json;
				console.log('resJson', resJson);
			})
			.done();
	});

	it('get#photos/all downloads a zip file with all photos', function () { });

	it('delete#photos/:id deletes a photo from storage and info from DB and returns deleted photo info', function () { });
});
