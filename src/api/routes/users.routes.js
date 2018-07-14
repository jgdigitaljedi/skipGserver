const express = require('express');
const router = express.Router();
const ctrlAuth = require('../controllers/user.controller');

/**
 * @api {post} /api/users/register Register new user
 * @apiName RegisterUser
 * @apiGroup Users
 * 
 * @apiParam {String} name user name
 * @apiParam {String} email user email
 * @apiParam {String} password encrpted user password
 * @apiDescription Registers a new user
 * @apiExample {json} Example request body:
 *    {name: "Test McTest", email: "test@test.com", password: "5g6a65867er5654f"}
 * @apiSuccessExample {json} Success response:
 *    {
 *      token: "n9iuas0dfg8uq348tuhas0d8f7ha38475hb0a8s7dfq8374th8a",
 *      admin: false
 *    }
 */
router.post('/register', ctrlAuth.register);

/**
 * @api {post} /api/users/login User login route
 * @apiGroup Users
 * @apiName Login
 * 
 * @apiParam {String} email user email
 * @apiParam {String} password encrpted user password
 * @apiDescription Run user login and returns JWT if successful
 * @apiExample {json} Example request body:
 *    {email: "test@test.com", password: "5g6a65867er5654f"}
 * @apiSuccessExample {json} Success response:
 *    {
 *      token: "n9iuas0dfg8uq348tuhas0d8f7ha38475hb0a8s7dfq8374th8a",
 *      admin: false
 *    }
 */
router.post('/login', ctrlAuth.login);

/**
 * @api {post} /api/users/devuser Test password and token creation
 * @apiGroup Users
 * @apiName DevUser
 * 
 * @apiParam {String} name user name
 * @apiParam {String} email user email
 * @apiParam {String} password encrpted user password
 * @apiDescription For dev purposes ONLY: Returns salt and hash for creds given.
 * @apiExample {json} Example request body:
 *    {name: "Test McTest", email: "test@test.com", password: "5g6a65867er5654f"}
 * @apiSuccessExample {json} Success response:
 *    {
 *      token: "n9iuas0dfg8uq348tuhas0d8f7ha38475hb0a8s7dfq8374th8a",
 *      user: {
 *        _id: "8723459872354",
 *        name: "Text McText",
 *        email: "test@test.com",
 *        admin: false,
 *        salt: "98h2345usbgdf987b345f",
 *        hash: "nsdfg98hj3456indfg98ha23i45no09g8yuha[092a345asdf87uh83475h"
 *      }
 *    }
 */
router.post('/devuser', ctrlAuth.devUser);

module.exports = router;
