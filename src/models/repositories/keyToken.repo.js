/** @format */

'use strict';

const keyTokenModel = require('../keytoken.model');
const { converToUUIDMongoose } = require('../../utils');

const tkn_findOne = async (filter) => {
	return keyTokenModel.findOne(filter).lean();
};
const tkn_deleteOne = async (filter) => {
	return keyTokenModel.deleteOne(filter);
};
const tkn_updateOne = async (filter, data) => {
	const option = { new: true, upsert: true };
	return keyTokenModel.findOneAndUpdate(filter, data, option).exec();
};
const tkn_checkKeyTokenVerify = async (clientId) => {
	return keyTokenModel.aggregate([
		{
			$match: {
				tkn_clientId: converToUUIDMongoose(clientId)
			}
		},
		{
			$lookup: {
				from: 'Users',
				localField: 'tkn_userId',
				foreignField: '_id',
				as: 'user'
			}
		},
		{
			$unwind: '$user'
		},
		{
			$project: {
				_id: 0,
				tkn_clientId: 1,
				tkn_userId: 1,
				tkn_publicKey: 1,
				tkn_refreshTokensUsed: 1,
				status: '$user.usr_status'
			}
		},
		{
			$match: {
				status: 'active'
			}
		}
	]);
};
module.exports = {
	tkn_findOne,
	tkn_deleteOne,
	tkn_updateOne,
	tkn_checkKeyTokenVerify
};
