/** @format */

'use strict';

const express = require('express');

const { asyncHandler } = require('@helpers/asyncHandler');
const { authertication } = require('@auth/utils.auth');
const { validateSchema } = require('@middlewares/joi.middleware');
const { joiAccess } = require('./services/access.service');
const router = express.Router();
const {
	Register,
	Login,
	Verify,
	RefreshToken,
	Logout
} = require('./controllers/index.controller');
const { grantsAccess } = require('@middlewares/rbac.middleware');
router.post(
	'/_register',
	validateSchema(joiAccess.signinup),
	asyncHandler(Register)
);
router.post('/_login', validateSchema(joiAccess.login), asyncHandler(Login));
router.use(authertication);
// handle token
router.get(
	'/_verify',
	grantsAccess('readOwn', 'Users'),
	asyncHandler(Verify, {
		redis: true,
		timeSetcache: 10
	})
);
router.delete('/_logout', asyncHandler(Logout));
router.patch('/_refresh', asyncHandler(RefreshToken));

module.exports = router;
