const express = require('express');
const router = express.Router();
const ctrlAdmin = require('../controllers/admin.controller');

/**
 * @api {get} /api/admin/listusers Get list of users
 * @apiName ListUsers
 * @apiGroup Admin
 * 
 * @apiPermission admin
 * @apiDescription Returns list of users from DB
 * @apiSuccessExample {json} Success response:
 *    [
 *      {
 *        _id: "23405986723045897",
 *        name: "Text McText",
 *        email: "test@test.com",
 *        admin: false
 *      },
 *      ...
 *    ]
 */
router.get('/listusers', ctrlAdmin.listUsers);

/**
 * @api {delete} /api/admin/deleteuser Delete a user
 * @apiName DeleteUser
 * @apiGroup Admin
 * 
 * @apiParam {Number} id userId
 * @apiPermission admin
 * @apiDescription Deletes a user from DB
 * @apiExample {json} Example request body:
 *    {id: 123456789}
 * @apiSuccessExample {json} Success response:
 *    [
 *      {
 *        _id: "23405986723045897",
 *        name: "Text McText",
 *        email: "test@test.com",
 *        admin: false,
 *        salt: "h9834hf87w0h45u",
 *        hash: "asdf982345n89asdf8h39845n98sdfh"
 *      }
 *    ]
 */
router.delete('/deleteuser', ctrlAdmin.deleteUser);

module.exports = router;
