/** @format */

'use strict';

const Md = require('../models/module.model');
const listModules = async () => {
	return Md.aggregate([
		{
			$project: {
				name: '$mds_name',
				id: '$mds_id',
				isMgroup: '$mds_isMgroup',
				isActive: '$mds_isActive',
				df_roleId: '$mds_df_roleId'
			}
		}
	]);
};
const checkStatusMd = async (name) => {
	return Md.findOne({
		mds_name: name,
		mds_isActive: true
	});
};
module.exports = {
	listModules,
	checkStatusMd
};
