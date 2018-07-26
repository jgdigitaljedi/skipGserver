const express = require('express');
const router = express.Router();
const ctrlProfile = require('../controllers/profile.controller');

// @TODO: write view get all comments and tags for display in profile page

/**
 * @api {get} /api/profile Get user profile
 * @apiName GetProfile
 * @apiGroup Profile
 * 
 * @apiDescription Gets user profile information from DB; Uses user ID from JWT
 * @apiSuccessExample {json} Success response:
 *      {
 *        error: false,
 *        firstName: "Test",
 *        lastName: "McTest",
 *        joinDate: "07/11/2018 12:45 am",
 *        lastUpdated: "07/25/2018 02:51 pm",
 *        email: "test@test.com",
 *        admin: false
 *      }
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
 *    {
 *        error: false,
 *        firstName: "Test",
 *        lastName: "McTest",
 *        joinDate: "07/11/2018 12:45 am",
 *        lastUpdated: "07/25/2018 02:51 pm",
 *        email: "test@test.com",
 *        admin: false
 *      }
 * @apiErrorExample {json} Error response:
 *    {error: <system error message>, message: 'ERROR: Error updating user data.'}
 */
router.patch('/', ctrlProfile.profileUpdate);

module.exports = router;
