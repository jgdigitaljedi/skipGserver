const axios = require('axios');
const common = require('./common');

global.login = function () {
  return new Promise((resolve, reject) => {
    return axios.post(`${common.baseUrl}user/login`, common.loginUserCreds)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        console.error('error', error);
        reject(error);
      });
  })
};
