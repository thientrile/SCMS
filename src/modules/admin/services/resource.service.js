/** @format */

'use strict';
const { connection, modelNames } = require('mongoose');
const ResourceModel = require('@models/resource.model');
const {
	convertToObjectIdMongoose,
	addPrefixToKeys
} = require('../../../utils');
const { BadRequestError } = require('@core/error.response');

const autoGenerateResource = async () => {
	const colls = modelNames().map((modelName) => {
		const model = connection.model(modelName);
		const attributes = Object.keys(model.schema.paths).map((key) => {
			if (key.includes('_') && key != '_id' && key != '__v') {
				const temp = key.trim().split('_');
				temp.shift();
				return temp.join('_');
				// Chỉ trả về nếu không rỗng
			}
			return key;
		});
		return { name: modelName + 's', attr: attributes };
	});
	// const listName = colls.map((item) => item.name);
	const createdResource = colls.map(async (item) => {
		const check = await ResourceModel.findOneAndUpdate(
			{ src_name: item.name },
			{
				src_attr: item.attr
			}
		);
		if (!check) {
			await ResourceModel.create({
				src_name: item.name,
				src_isRoot: true,
				src_description: `created by system`,
				src_attr: item.attr,
				src_icon: ''
			});
		}
	});
	await Promise.all(createdResource);
	

	return colls;
};
const deleteResource = async (payload) => {
	const { resourceId } = payload;
	const result = await ResourceModel.findOneAndDelete({
		_id: convertToObjectIdMongoose(resourceId)
	});
	if (!result) {
		throw new BadRequestError('Resource not found');
	}
	return true;
};
const updateOneResource = async (payload) => {
	const data = addPrefixToKeys(payload, 'src_');
	const result = await ResourceModel.findOneAndUpdate(
		{ _id: convertToObjectIdMongoose(payload.id) },
		{ ...data }
	);
	if (!result) {
		throw new BadRequestError('Resource not found');
	}
	return true;
};

module.exports = { autoGenerateResource, deleteResource, updateOneResource };
