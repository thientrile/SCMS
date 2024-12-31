/** @format */

'use strict';

const keytokenModel = require('@models/keytoken.model');
const {
	converToUUIDMongoose,
	convertToObjectIdMongoose
} = require('../../../utils/index');
const {
	tkn_findOne,
	tkn_deleteOne,
	tkn_updateOne
} = require('@repositories/keyToken.repo');
const { setData } = require('../../../database/redis.db');
/**
 *
 * @param {String} userId
 * @param {String} publicKey
 * @param {String} token
 * @param {String} privateKey
 * @todo   create a key token for some deviect
 * @returns {clientId,token}
 */

const createKeyToken = async ({ userId, publicKey, privateKey }) => {
	const tokens = await keytokenModel.create({
		tkn_userId: userId,
		tkn_publicKey: publicKey,
		tkn_privateKey: privateKey
	});

	return tokens ? { clientId: tokens.tkn_clientId } : null;
};

const findByClientId = async (clientId) => {
	return tkn_findOne({ tkn_clientId: converToUUIDMongoose(clientId) });
};
const deleteByClientId = async (clientId) => {
	return tkn_deleteOne({ tkn_clientId: converToUUIDMongoose(clientId) });
};
const updateById = async (id, data) => {
	return tkn_updateOne(
		{
			_id: convertToObjectIdMongoose(id)
		},
		data
	);
};
module.exports = {
	createKeyToken,
	findByClientId,
	deleteByClientId,
	updateById
};
