/** @format */

'use strict';
const express = require('express');

const { asyncHandler } = require('../../helpers/asyncHandler');
const { authertication } = require('../../auth/utils.auth');
const { UserInfo } = require('./controllers/index.controller');
const { grantsReq } = require('../../middlewares/rbac.middleware');
const router = express.Router();
router.use(authertication);
router.get('/_info', grantsReq('readOwn', 'Users'), asyncHandler(UserInfo));
module.exports = router;
