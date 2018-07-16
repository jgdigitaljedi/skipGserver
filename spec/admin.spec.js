const frisby = require('frisby');
const common = require('./common');

describe('Admin', function() {
    it('should fail when request not made from admin', function() {
        return frisby.get(`${common.baseUrl}admin/listusers`).expect('status', 401);
    });
});
