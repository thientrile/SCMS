/** @format */

'use strict';
const { convertToObjectIdMongoose, getSelectData } = require('../../utils');
const Menu = require('../menu.model');

const getMenuByMdId = async (mdId) => {
	return Menu.findOne({ men_moduleId: convertToObjectIdMongoose(mdId) }).select(
		getSelectData(['men_arr'])
	);
};
module.exports = {
	getMenuByMdId
};
