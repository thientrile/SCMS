/** @format */

'use strict';
const express = require('express');

const { asyncHandler } = require('@helpers/asyncHandler');

const { joiModule } = require('./services/modules.service');
const {
	GetAllModules,
	CreateModule
} = require('./controllers/module.controller');
const { validateSchema } = require('../../middlewares/joi.middleware');
const { grantsAccess } = require('../../middlewares/rbac.middleware');
const { AutoGenerateMenu, GetMenu } = require('./controllers/menu.controller');
const router = express.Router();
// check status
// RBAC
router.use('/rbac', require('./router/rbac.router'));

//  resource
router.use('/resource', require('./router/resource.router'));
// module
router.use('/module', require('./router/module.router'));

// // menu
// router.put(
// 	'/menu/_auto',
// 	grantsAccess('updateAny', 'Menus'),
// 	asyncHandler(AutoGenerateMenu)
// );
// router.get(
// 	'/menu/_get',
// 	grantsAccess('readOwn', 'Menus'),
// 	asyncHandler(GetMenu)
// );
module.exports = router;
