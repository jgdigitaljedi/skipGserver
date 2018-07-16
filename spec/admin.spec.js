const frisby = require('frisby');
const common = require('./common');

describe('Admin', function() {
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
                console.error('Admin beforeAll promise rejected', err);
            });
    });

    it('get#admin/listusers should fail when request not made from admin', function() {
        return frisby.get(`${common.baseUrl}admin/listusers`).expect('status', 401);
    });
});
