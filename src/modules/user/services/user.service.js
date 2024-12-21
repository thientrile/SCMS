/** @format */

'use strict';
const { number } = require('joi');
const userModel = require('../../../models/user.model');
const {
	removePrefixFromKeys,
	convertToObjectIdMongoose
} = require('../../../utils');

const getUserInfo = async (userId) => {
	const result = await userModel
		.findOne({ _id: convertToObjectIdMongoose(userId) })
		.exec();

	const removePreFix = removePrefixFromKeys(result.toObject(), 'usr_');
	return removePreFix;
};

module.exports = {
	getUserInfo
};
