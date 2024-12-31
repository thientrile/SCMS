/** @format */

'use strict';
const ResourceModel = require('@models/resource.model');
const RoleModel = require('@models/role.model');
const {
	convertToObjectIdMongoose,
	addPrefixToKeys,
	createMongoObjectId,
	removePrefixFromKeys
} = require('../../../utils');
const { BadRequestError } = require('../../../core/error.response');
const { initAccessControl } = require('../../../middlewares/rbac.middleware');
const { getAllListRole } = require('@repositories/role.repo');
const { getRoleNameByUserId } = require('@repositories/user.repo');
const { extendUser } = require('./role.service');

// Create Resource
async function createResource(payload) {
	const data = addPrefixToKeys(payload, 'src_', ['_id']);
	const result = await ResourceModel.create(data);
	return removePrefixFromKeys(result.toObject(), 'src_');
}

// Get Resource List
async function resourceList({ limit = 30, offset = 0, search = '' }) {
	const results = await ResourceModel.aggregate([
		{
			$project: {
				name: '$src_name',
				slug: '$src_slug',
				description: '$src_description',
				_id: 1,
				isRoot: '$src_isRoot',
				icon: '$src_icon',
				createdAt: 1
			}
		},
		{
			$match: {
				$or: [
					{ name: { $regex: search, $options: 'i' } },
					{ slug: { $regex: search, $options: 'i' } },
					{ description: { $regex: search, $options: 'i' } }
				]
			}
		},
		{
			$facet: {
				totalCount: [{ $count: 'count' }], // Tính tổng số lượng tài nguyên
				paginatedResults: [
					{ $sort: { createdAt: -1 } }, // Sắp xếp kết quả
					{ $skip: parseInt(offset) }, // Bỏ qua số lượng theo offset
					{ $limit: parseInt(limit) } // Giới hạn số lượng theo limit
				]
			}
		}
	]);

	// Xử lý kết quả
	const totalCount = results[0].totalCount[0]?.count || 0;
	const paginatedResults = results[0].paginatedResults;

	return {
		totalCount,
		paginatedResults
	};
}

// Create Role by admin
async function createRoleRoot(payload) {
	const parentId = (await getRoleNameByUserId(userId)).usr_role._id;
	const checkExist = await RoleModel.findOne({
		rol_name: payload.name,
		rol_parents: { $in: [convertToObjectIdMongoose(parentId)] }
	});
	payload.userId = convertToObjectIdMongoose(userId);
	payload.parents = { _id: convertToObjectIdMongoose(parentId) };
	if (checkExist) {
		throw new BadRequestError('Role already exists');
	}
	payload.isRoot = true;
	payload._id = createMongoObjectId();
	const data = addPrefixToKeys(payload, 'rol_', ['_id']);

	await Promise.all([
		await RoleModel.create(data),
		await extendUser(payload._id)
	]);

	const [allListRole] = await Promise.all([
		await getAllListRole(),
		await initAccessControl()
	]);

	return allListRole;
}

// Add Grants to Role
async function addGrantsToRole(payload) {
	const { roleId, grants } = payload;

	const checkRoleExist = await RoleModel.findOneAndUpdate(
		{ _id: convertToObjectIdMongoose(roleId) },
		{ $push: { rol_grants: grants } } // Use $push to add elements to array
	);
	if (!checkRoleExist) {
		throw new BadRequestError('Role not found');
	}

	const [allListRole] = await Promise.all([
		await getAllListRole(),
		await initAccessControl()
	]);
	return allListRole;
}
// set Grants to role
async function setGrantsToRole(payload) {
	const { roleId, grants } = payload;
	const result = await RoleModel.findOneAndUpdate(
		{ _id: convertToObjectIdMongoose(roleId) },
		{ rol_grants: grants } // Use $push to add elements to array
	);
	if (!result) {
		throw new BadRequestError('Role not found');
	}
	await initAccessControl();

	return result;
}
const delGrantstoRole = async (payload) => {
	const { roleId, grantId } = payload;
	const rol = await RoleModel.findOneAndUpdate(
		{ _id: convertToObjectIdMongoose(roleId) },
		{ $pull: { rol_grants: { _id: convertToObjectIdMongoose(grantId) } } }
	);

	await initAccessControl();

	return rol;
};

// get all list role
const getListAllRole = async () => {
	return getAllListRole();
};
const deleteRole = async (payload) => {
	const { roleId } = payload;
	const role = await RoleModel.findById(convertToObjectIdMongoose(roleId));
	if (!role) {
		throw new BadRequestError('Role not found');
	}
	role.rol_status = role.rol_status === 'active' ? 'block' : 'active';
	await role.save();

	const [allListRole] = await Promise.all([
		await getAllListRole(),
		await initAccessControl()
	]);

	return allListRole;
};

module.exports = {
	resourceList,
	createResource,
	createRoleRoot,
	addGrantsToRole,
	getListAllRole,
	delGrantstoRole,
	setGrantsToRole,
	deleteRole
};
