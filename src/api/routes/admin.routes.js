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
 * @apiErrorExample {json} Error response:
 *    {error: <system error message>, message: 'ERROR: Something went wrong with fetching list of users.'}
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
 *  {
 *    error: false,
 *    user:
 *      [
 *        {
 *          _id: "23405986723045897",
 *          firstName: "Test",
 *          lastName: "McTest",
 *          email: "test@test.com",
 *          admin: false,
 *          joinDate: '07/24/2018 08:48 am',
 *          lastUpdated: '07/24/2018 08:48 am',
 *          salt: "h9834hf87w0h45u",
 *          hash: "asdf982345n89asdf8h39845n98sdfh"
 *        }
 *      ]
 *  }
 *    
 * @apiErrorExample {json} Error response:
 *    {error: <system error message>, message: 'ERROR: Something went wrong with deleting the user.'}
 */
router.delete('/deleteuser', ctrlAdmin.deleteUser);

/**
 * @api {post} /api/admin/useractive Change user active statuss
 * @apiName ChangeUserActive
 * @apiGroup Admin
 * 
 * @apiPermission admin
 * @apiDescription Changes a user's active status
 * @apiExample {json} Example request body:
 *    {_id: 123456789, active: true}
 * @apiSuccessExample {json} Success response:
 *  {
 *    error: false,
 *    user:
 *      [
 *        {
 *          _id: "23405986723045897",
 *          firstName: "Test",
 *          lastName: "McTest",
 *          email: "test@test.com",
 *          admin: false,
 *          joinDate: '07/24/2018 08:48 am',
 *          lastUpdated: '07/24/2018 08:48 am',
 *          salt: "h9834hf87w0h45u",
 *          hash: "asdf982345n89asdf8h39845n98sdfh"
 *        }
 *      ]
 *  }
 *    
 * @apiErrorExample {json} Error response:
 *    {error: <system error message>, message: 'ERROR: Problem updating user active property.'}
 * **/
router.post('/useractive', ctrlAdmin.changeUserActive);

module.exports = router;
