/** @format */

'use strict';
const Menu = require('../../../models/menu.model');
const { getMenuByMdId } = require('../../../models/repositories/menu.repo');
const { listModules } = require('../../../models/repositories/module.reop');
const { getGrantsById } = require('../../../models/repositories/role.repo');
const { convertToObjectIdMongoose } = require('../../../utils');
// auto Generate Menu for all module
const autoGenerateMenu = async () => {
	const modules = await listModules();
	const menu = modules.map(async (module) => {
		const listGrants = await getGrantsById(module.df_roleId);
		const arr = listGrants.flatMap((item) => {
			const actions = [];
			item.actions.forEach((action) => {
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
		return Menu.findOneAndUpdate(
			{
				men_moduleId: convertToObjectIdMongoose(module._id)
			},
			{
				$set: {
					men_arr: arr
				}
			},
			{
				upsert: true,
				new: true
			}
		).exec();
	});
	await Promise.all(menu);
	return 1;
};

const getMenu = async (roleId, module) => {
	const [listGrants, existingMenu] = await Promise.all([
		await getGrantsById(roleId),
		await getMenuByMdId(module._id)
	]);
	const arr = listGrants.flatMap((item) => {
		const actions = [];
		item.actions.forEach((action) => {
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

	existingMenu.men_arr.forEach((item) => {
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
module.exports = {
	autoGenerateMenu,
	getMenu
};
