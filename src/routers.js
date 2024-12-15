/** @format */

'use strict';

const express = require('express');
const { apiKey, permission } = require('./auth/check.auth');
const router = express.Router();
router.use(apiKey);
router.use(permission('access'));
router.use('/access', require('./modules/access/index'));
router.use('/upload', require('./modules/upload/index'));
router.use(permission('user'));
router.use('/user', require('./modules/user/index'));
router.use(permission('shop'));

router.use(permission('admin'));
router.use('/admin', require('./modules/admin/index'));

module.exports = router;
