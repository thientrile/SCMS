/** @format */

'use strict';
const express = require('express');

const { asyncHandler } = require('../../helpers/asyncHandler');
const { authertication } = require('../../auth/utils.auth');
const { UserInfo } = require('../../controllers/user');
const router = express.Router();
router.use(authertication);
router.get('/_info', asyncHandler(UserInfo));
module.exports = router;
