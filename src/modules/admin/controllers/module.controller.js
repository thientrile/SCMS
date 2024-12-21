/** @format */

'use strict';
const {
	SuccessReponse,
	CREATED,
	OK
} = require('../../../core/success.response');
const { getAllModules, newModule } = require('../services/modules.service');

const CreateModule = async (req, res) => {
	
	new SuccessReponse({
		message: 'Module was created successfully',
		metadata: await newModule( req.body)
	}).send(req, res);
};
const GetAllModules =async (req, res) => {
	new SuccessReponse({
		message: 'List of all modules',
		metadata: await getAllModules()
	}).send(req, res);
}
module.exports = {
  CreateModule,
	GetAllModules
};
