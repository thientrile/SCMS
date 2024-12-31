/** @format */

'use strict';
const express = require('express');

const { asyncHandler } = require('@helpers/asyncHandler');
const { authertication } = require('@auth/utils.auth');
const { UserInfo } = require('./controllers/index.controller');
const { grantsAccess } = require('@middlewares/rbac.middleware');
const router = express.Router();
router.use(authertication);
router.get(
	'/_info',
	grantsAccess('readOwn', 'Users'),
	asyncHandler(UserInfo, {
		 redis: true,
		timeSetcache: 30
	})
);
module.exports = router;
