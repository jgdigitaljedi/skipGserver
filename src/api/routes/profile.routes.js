const express = require('express');
const router = express.Router();
const ctrlProfile = require('../controllers/profile.controller');

// @TODO: write view profile endpoint (should get all uploads and comments as well as return user info)

/**
 * @api {get} /api/profile Get user profile
 * @apiName GetProfile
 * @apiGroup Profile
 * 
 * @apiDescription Gets user profile information from DB; Uses user ID from JWT
 * @apiSuccessExample {json} Success response:
 *    [
 *      {
 *        name: "Text McText",
 *        email: "test@test.com",
 *        admin: false
 *      }
 *    ]
 * @apiErrorExample {json} Error response:
 *    {error: <system error message>, message: 'ERROR: Error fetching user profile.'}
 */
router.get('/', ctrlProfile.profileRead);

/**
 * @api {patch} /api/profile Update user profile
 * @apiName UpdateProfile
 * @apiGroup Profile
 * 
 * @apiDescription Updates user name or email in DB; Uses user ID from JWT
 * @apiExample {json} Example request body:
 *    {name: "Tester McTest"}
 * @apiSuccessExample {json} Success response:
 *    [
 *      {
 *        name: "Text McText",
 *        email: "test@test.com",
 *        admin: false
 *      }
 *    ]
 * @apiErrorExample {json} Error response:
 *    {error: <system error message>, message: 'ERROR: Error updating user data.'}
 */
router.patch('/', ctrlProfile.profileUpdate);

// @TODO: write change password

module.exports = router;
