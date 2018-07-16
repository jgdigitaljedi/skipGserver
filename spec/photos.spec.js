const frisby = require('frisby');
const Joi = frisby.Joi;
const common = require('./common');
const axios = require('axios');

describe('Photos', function () {
  let user;
  let headers;
  let photos;
  beforeAll((done) => {
    global.login()
      .then((res) => {
        user = res.data;
        headers = {
          Authorization: `Bearer ${user.token}`
        };
        return axios.get(`${common.baseUrl}photospublic`)
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

  it('get#photos/info/:id should get DB info for a photo', function () {

  });
});
