/** @format */

const {
	AutoImportResource,
	updateResource
} = require('@modules/admin/controllers/resource.controller');

const express = require('express');
const router = express.Router();
const { asyncHandler } = require('@helpers/asyncHandler');
const { grantsAccess } = require('@middlewares/rbac.middleware');
const { authertication } = require('@auth/utils.auth');
router.use(authertication);
//  resource
router.patch(
	'/_import',
	grantsAccess('createAny', 'Resources'),
	asyncHandler(AutoImportResource)
);
router.patch(
	'/_update',
	grantsAccess('updateAny', 'Resources'),
	asyncHandler(updateResource)
);
module.exports = router;
