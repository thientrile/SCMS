/** @format */

'use strict';
const Joi = require('joi');
const Md = require('@models/module.model');
const Grp = require('@models/group.model');
const { listModules } = require('@repositories/module.reop');
const {
	removePrefixFromKeys,
	addPrefixToKeys,
	randomId,
	convertToObjectIdMongoose
} = require('@utils/index');
const { getGrantsById } = require('@models/repositories/role.repo');
const newModule = async (payload) => {
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
const autoGenerateMenu = async () => {
	const modules = await listModules();
	const menu = modules.map(async (module) => {
		const listGrants = await getGrantsById(module.df_roleId);
		const arr = listGrants.flatMap((item) => {
			const actions = [];
			item.actions[0].forEach((action) => {
				for (let i of action) {
					if (!actions.includes(i)) {
						actions.push(i);
					}
				}
			});
			return {
				id: `${item._id}`,
				label: item.label,
				actions: actions,
				icon: `${item.icon}`,
				to: `/${item.label}`.toLowerCase(),
				childrens: [],
				isRequire: false
			};
		});
		arr.push({
			label: 'Dashboard',
			icon: 'material-symbols:home-outline',
			to: '/',
			isRequire: true
		});
		return Md.findOneAndUpdate(
			{
				_id: convertToObjectIdMongoose(module._id),
				mds_menu: []
			},
			{
				$set: {
					mds_menu: arr
				}
			}
		).exec();
	});
	await Promise.all(menu);
	return 1;
};

const getMenu = async (roleId, module) => {
	const listGrants = await getGrantsById(roleId);
	const existingMenu = module.mds_menu;

	const arr = listGrants.flatMap((item) => {
		const actions = [];
		item.actions[0].forEach((action) => {
			for (let i of action) {
				if (!actions.includes(i)) {
					actions.push(i);
				}
			}
		});
		return {
			id: `${item._id}`,
			label: item.label,
			actions: actions,
			icon: '',
			to: `/${item.label}`.toLowerCase()
		};
	});

	existingMenu.forEach((item) => {
		arr.forEach((arrItem, index) => {
			if (arrItem.id == item.id) {
				arr[index].label = item.label;
				arr[index].icon = item.icon;
				arr[index].to = item.to;
				arr[index].childrens = item.childrens;
			}
		});
		if (item.isRequire) {
			arr.unshift(item);
		}
	});

	return arr;
};

const joiModule = Joi.object({
	name: Joi.string().required(),
	isMgroup: Joi.boolean(),
	df_roleId: Joi.string().required()
});
module.exports = {
	newModule,
	getAllModules,
	autoGenerateMenu,
	joiModule,
	getMenu
};
