/** @format */

'use strict';

const express = require('express');
const { apiKey, permission } = require('../auth/check.auth');
const router = express.Router();
router.use(apiKey);
router.use(permission('access'));
router.use('/access', require('./access/index'));
router.use('/upload', require('./upload/index'));
router.use(permission('user'));
router.use('/user', require('./user/index'));
router.use(permission('shop'));
router.use('/shop', require('./shop/index'));
router.use(permission('admin'));
router.use('/admin', require('./admin/index'));

module.exports = router;
