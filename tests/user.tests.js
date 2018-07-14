const frisby = require('frisby');
const common = require('./common');

module.exports.testRegister = function() {
	it('should register a new user and get back a token', function() {
		frisby.post(`${common.baseUrl}user/register`);
	});
};
