/** @format */

'use strict';

const roleModel = require('../../../models/role.model');
const { convertToObjectIdMongoose } = require('@utils/index');
const extendUser = async (id) => {
	return await roleModel.findOneAndUpdate(
		{
			rol_slug: '1',
			rol_isRoot: true,
			rol_parents: { $ne: convertToObjectIdMongoose(id) } // Ensure `_id` isn't already in the array
		},
		{
			$push: {
				rol_parents: convertToObjectIdMongoose(id)
			}
		},
		{ new: true } // Return the updated document
	);
};

module.exports = {
	extendUser,
};
