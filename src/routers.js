/** @format */

'use strict';

const express = require('express');
const { apiKey, permission, Hmac } = require('./auth/check.auth');
const router = express.Router();
router.use(apiKey);
router.use(Hmac);
router.use('/access', permission('access'), require('./modules/access/index'));
router.use('/user', permission('user'), require('./modules/user/index'));
router.use('/admin', permission('admin'), require('./modules/admin/index'));

module.exports = router;
