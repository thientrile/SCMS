/** @format */

'use strict';
const express = require('express');
const router = express.Router();
const { asyncHandler } = require('@helpers/asyncHandler');
const { grantsAccess } = require('@middlewares/rbac.middleware');
const { authertication } = require('@auth/utils.auth');
const {
	SetGrants,
	GetResources,
	GetRoles,
	DelGrant,
	CreateResource,
	CreateRole,
	Delrole,
	DelReource,
	AddGrants
} = require('@modules/admin/controllers/rbac.controller');

router.use(authertication);
router.patch(
	'/role/_setGrants',
	grantsAccess('updateAny', 'Roles'),
	asyncHandler(SetGrants)
);
router.patch(
	'/role/_addGrants',
	grantsAccess('updateAny', 'Roles'),
	asyncHandler(AddGrants)
);

router.get('/roles', grantsAccess('readAny', 'Roles'), asyncHandler(GetRoles));
router.patch(
	'/role/_delgrant',
	grantsAccess('deleteAny', 'Roles'),
	asyncHandler(DelGrant)
);
router.post(
	'/resource/_create',
	grantsAccess('createAny', 'Resources'),
	asyncHandler(CreateResource)
);
router.post(
	'/role/_create',
	grantsAccess('createAny', 'Roles'),
	asyncHandler(CreateRole)
);
router.delete(
	'/role/_delete',
	grantsAccess('deleteOwn', 'Roles'),
	asyncHandler(Delrole)
);
router.delete(
	'/resource/_delete',
	grantsAccess('deleteAny', 'Resources'),
	asyncHandler(DelReource)
);
router.get(
	'/resources',
	grantsAccess('readAny', 'Resources'),
	asyncHandler(GetResources)
);
module.exports = router;
