/** @format */

'use strict';

const {
	SuccessReponse,
	CREATED,
	OK
} = require('@core/success.response');
const { autoGenerateMenu, getMenu } = require('../services/menu.service');
const AutoGenerateMenu = async (req, res) => {
	new SuccessReponse({
		message: 'List of all modules',
		metadata: await autoGenerateMenu()
	}).send(req, res);
};
const GetMenu = async (req, res) => {
	new SuccessReponse({
		message: 'List of all modules',
		metadata: await getMenu(req.roleId, req.module)
	}).send(req, res);
};
module.exports = {
	AutoGenerateMenu,
	GetMenu
};
