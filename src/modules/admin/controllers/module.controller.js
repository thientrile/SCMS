/** @format */

'use strict';
const { SuccessReponse, CREATED, OK } = require('@core/success.response');
const {
	getAllModules,
	newModule,
	autoGenerateMenu,
	getMenu
} = require('../services/modules.service');

const CreateModule = async (req, res) => {
	new SuccessReponse({
		message: 'Module was created successfully',
		metadata: await newModule(req.body)
	}).send(req, res);
};
const GetAllModules = async (req, res) => {
	new SuccessReponse({
		message: 'List of all modules',
		metadata: await getAllModules()
	}).send(req, res);
};
const AutoGenerateMenu = async (req, res) => {
	new SuccessReponse({
		message: 'Menu was created successfully',
		metadata: await autoGenerateMenu()
	}).send(req, res);
};
const Getmenu = async (req, res) => {
	new SuccessReponse({
		message: 'list of all menus',
		metadata: await getMenu(req.roleId, req.module)
	}).send(req, res);
};
module.exports = {
	CreateModule,
	GetAllModules,
	AutoGenerateMenu,
	Getmenu
};
