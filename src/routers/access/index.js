/** @format */

'use strict';

const express = require('express');
const { asyncHandler } = require('../../helpers/asyncHandler');

const { authertication } = require('../../auth/utils.auth');
const {
	Register,
	Login,
	Verify,
	RefreshToken,
	Logout
} = require('../../controllers/access');
const { limitReq } = require('../../auth/check.auth');
const { validateSchema } = require('../../middlewares/joi.middleware');
const { joiAccess } = require('../../services/access/access.service');
const router = express.Router();
router.post('/_register', validateSchema(joiAccess.signinup),asyncHandler(Register));
router.post('/_login', validateSchema(joiAccess.login), asyncHandler(Login));
router.use(authertication);
router.get('/_verify', asyncHandler(Verify));
router.get('/_logout', asyncHandler(Logout));
router.patch('/_refresh', limitReq(10), asyncHandler(RefreshToken));

module.exports = router;
