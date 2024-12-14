/** @format */

'use strict';

const { initAccessControl } = require('../middlewares/rbac.middleware');
const roleModel = require('../models/role.model');
const { convertToObjectIdMongoose } = require('../utils');
const extendUser = async (id) => {
	return await roleModel.findOneAndUpdate(
		{
			rol_slug: '1',
			rol_isRoot: true,
			'rol_parents._id': { $ne: convertToObjectIdMongoose(id) } // Ensure `_id` isn't already in the array
		},
		{
			$push: {
				rol_parents: { _id: convertToObjectIdMongoose(id) }
			}
		},
		{ new: true } // Return the updated document
	);
};
const registerRoleForUser = async (name) => {
	const reslut = await roleModel.create({ rol_name: name });
	await extendUser(reslut._id);
	await initAccessControl();
	return reslut._id;
};
module.exports = {
	extendUser,
	registerRoleForUser
};
