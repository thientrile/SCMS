/** @format */

'use strict';
const express = require('express');

const { asyncHandler } = require('../../helpers/asyncHandler');
const { authertication } = require('../../auth/utils.auth');
const {
	GetResources,
	SetGrants,
	GetRoles,
	DelGrant,
	CreateResource,
	CreateRole,
	Delrole,
	DelReource,
	AddGrants
} = require('./controllers/rbac.controller');
const { AutoImportResource } = require('./controllers/resource.controller');
const { newModule, joiModule } = require('./services/modules.service');
const {
	GetAllModules,
	CreateModule
} = require('./controllers/module.controller');
const { validateSchema } = require('../../middlewares/joi.middleware');
const { grantsReq } = require('../../middlewares/rbac.middleware');
const router = express.Router();
// check status
router.use(authertication);
// RBAC
router.patch(
	'/rbac/role/_setGrants',
	grantsReq('updateAny', 'Roles'),
	asyncHandler(SetGrants)
);
router.patch(
	'/rbac/role/_addGrants',
	grantsReq('updateAny', 'Roles'),
	asyncHandler(AddGrants)
);

router.get(
	'/rbac/roles',
	grantsReq('readAny', 'Roles'),
	asyncHandler(GetRoles)
);
router.patch(
	'/rbac/role/_delgrant',
	grantsReq('deleteAny', 'Roles'),
	asyncHandler(DelGrant)
);
router.post(
	'/rbac/resource/_create',
	grantsReq('createAny', 'Resources'),
	asyncHandler(CreateResource)
);
router.post(
	'/rbac/role/_create',
	grantsReq('createAny', 'Roles'),
	asyncHandler(CreateRole)
);
router.delete(
	'/rbac/role/_delete',
	grantsReq('deleteOwn', 'Roles'),
	asyncHandler(Delrole)
);
router.delete(
	'/rbac/resource/_delete',
	grantsReq('deleteAny', 'Resources'),
	asyncHandler(DelReource)
);
router.get(
	'/rbac/resources',
	grantsReq('readAny', 'Resources'),
	asyncHandler(GetResources)
);

//  resource
router.patch(
	'/resource/_import',
	grantsReq('createAny', 'Resources'),
	asyncHandler(AutoImportResource)
);
router.post(
	'/module/_new',
	validateSchema(joiModule),
	asyncHandler(CreateModule)
);

// module
router.get(
	'/module/_all',
	grantsReq('readAny', 'Modules'),
	asyncHandler(GetAllModules)
);
module.exports = router;
