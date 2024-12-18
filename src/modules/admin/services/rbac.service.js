/** @format */

'use strict';
const ResourceModel = require('../../../models/resource.model');
const RoleModel = require('../../../models/role.model');
const {
	convertToObjectIdMongoose,
	renameObjectKey,
	addPrefixToKeys,
	createMongoObjectId
} = require('../../../utils');
const { BadRequestError } = require('../../../core/error.response');
const {
	grantAccess,
	initAccessControl
} = require('../../../middlewares/rbac.middleware');
const { getAllListRole, getGrants } = require('../../../repositories/role.repo');
const { getRoleNameByUserId } = require('../../../repositories/user.repo');
const userModel = require('../../../models/user.model');
const { extendUser } = require('./role.service');

// Create Resource
async function createResource(userId, { name, slug, description }) {
	await grantAccess(userId, 'createAny', 'Resources');

	try {
		const resource = await ResourceModel.create({
			src_name: name,
			src_slug: slug,
			src_description: description
		});

		return renameObjectKey(
			{
				src_name: 'name',
				src_slug: 'slug',
				src_description: 'description',
				_id: 'resourceId'
			},
			resource.toObject()
		);
	} catch (err) {
		if (err.code === 11000) {
			// Check for duplicate key error
			throw new BadRequestError('Resource already exists');
		} else {
			throw err; // Rethrow other errors for potential handling
		}
	}
}

// Get Resource List
async function resourceList(userId, { limit = 30, offset = 0, search = '' }) {
	await grantAccess(userId, 'readAny', 'Resources');

	const resources = await ResourceModel.aggregate([
		{
			$project: {
				name: '$src_name',
				slug: '$src_slug',
				description: '$src_description',
				_id: 0,
				resourceId: '$_id',
				isRoot: '$src_isRoot',
				menu: '$src_menu',

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
		{ $sort: { createdAt: -1 } },
		{ $skip: parseInt(offset) },
		{ $limit: parseInt(limit) }
	]);

	return resources;
}

// Create Role by admin
async function createRoleRoot(userId, payload) {
	await grantAccess(userId, 'createAny', 'Roles');
	const parentId = (await getRoleNameByUserId(userId)).usr_role._id;
	const checkExist = await RoleModel.findOne({
		rol_name: payload.name,
		rol_parents: { $in: [{ _id: convertToObjectIdMongoose(parentId) }] },
		rol_isRoot: true
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
async function addGrantsToRole(userId, payload) {
	await grantAccess(userId, 'updateAny', 'Roles');
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
async function setGrantsToRole(userId, payload) {
	await grantAccess(userId, 'updateAny', 'Roles');
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
const delGrantstoRole = async (userId, payload) => {
	await grantAccess(userId, 'deleteAny', 'Roles');
	const { roleId, grantId } = payload;
	const rol = await RoleModel.findOneAndUpdate(
		{ _id: convertToObjectIdMongoose(roleId) },
		{ $pull: { rol_grants: { _id: convertToObjectIdMongoose(grantId) } } }
	);

	await initAccessControl();

	return rol;
};

// Get  list grants access control
async function listGrants({ userId = 0, limit = 30, offset = 0, search = '' }) {
	// You might want to consider adding the access control check here as well
	await grantAccess(userId, 'readAny', 'Roles');

	return await getGrants(limit, offset, search);
}
// get all list role
const getListAllRole = async (userId) => {
	await grantAccess(userId, 'readAny', 'Roles');
	const roles = await getAllListRole();
	return roles;
};
const deleteRole = async (userId, payload) => {
	await grantAccess(userId, 'deleteOwn', 'Roles');
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
	listGrants,
	addGrantsToRole,
	getListAllRole,
	delGrantstoRole,
	setGrantsToRole,
	deleteRole
};
