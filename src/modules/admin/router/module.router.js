/** @format */

const express = require('express');

const { asyncHandler } = require('../../../helpers/asyncHandler');
const { authertication } = require('../../../auth/utils.auth');
const { joiModule } = require('@modules/admin/services/modules.service');
const {
	GetAllModules,
	CreateModule,
	AutoGenerateMenu,
	Getmenu
} = require('../controllers/module.controller');
const { validateSchema } = require('@middlewares/joi.middleware');
const { grantsAccess } = require('@middlewares/rbac.middleware');
const router = express.Router();
router.use(authertication);
router.post('/_new', validateSchema(joiModule), asyncHandler(CreateModule));

router.get(
	'/_all',
	grantsAccess('readAny', 'Modules'),
	asyncHandler(GetAllModules)
);

router.patch(
	'/menu/generate_menu',
	grantsAccess('updateAny', 'Menus'),
	asyncHandler(AutoGenerateMenu)
);
router.get('/menu', grantsAccess('readOwn', 'Menus'), asyncHandler(Getmenu));
module.exports = router;
