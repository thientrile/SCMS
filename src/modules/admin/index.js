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
const router = express.Router();
router.use(authertication);
// RBAC
router.patch('/rbac/role/_setGrants', asyncHandler(SetGrants));
router.patch('/rbac/role/_addGrants', asyncHandler(AddGrants));
router.get('/rbac/resources', asyncHandler(GetResources));
router.get('/rbac/roles', asyncHandler(GetRoles));
router.patch('/rbac/role/_delgrant', asyncHandler(DelGrant));
router.post('/rbac/resource/_create', asyncHandler(CreateResource));
router.post('/rbac/role/_create', asyncHandler(CreateRole));
router.delete('/rbac/role/_delete', asyncHandler(Delrole));
router.delete('/rbac/resource/_delete', asyncHandler(DelReource));

// Auto import resource

router.get('/resource/_import', asyncHandler(AutoImportResource));
module.exports = router;
