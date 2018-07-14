const frisby = require('frisby');
const user = require('./user.tests');

describe('User', function() {
	user.testRegister();
});
