/** @format */

'use strict';
const Joi = require('joi');
const Md = require('../../../models/module.model');
const Grp = require('../../../models/group.model');
const { listModules } = require('../../../repositories/module.reop');
const {
	removePrefixFromKeys,
	filterConvert,
	addPrefixToKeys,
	randomId
} = require('../../../utils');
const newModule = async ( payload) => {
	const checkMd = await Md.findOne({ mds_name: payload.name });

	if (checkMd) throw new Error('Module name already exists');
	payload.id = parseInt(randomId());
	const data = addPrefixToKeys(payload, 'mds_');
	const newModule = (await Md.create(data)).toObject();
	if (!newModule.mds_isMgroup) {
		const group = {
			grp_name: payload.name,
			grp_code: payload.id,
			grp_id: parseInt(randomId()),
			grp_moduleId: newModule._id,
			grp_isActive: true,
			grp_members: []
		};
		await Grp.create(group);
	}
	return removePrefixFromKeys(newModule, 'mds_');
};
const getAllModules = async () => {
	return await listModules();
};
const joiModule = Joi.object({
	name: Joi.string().required(),
	isMgroup: Joi.boolean(),
	df_roleId: Joi.string().required()
});
module.exports = {
	newModule,
	getAllModules,
	joiModule
};
