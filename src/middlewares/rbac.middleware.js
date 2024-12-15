/** @format */

'use strict';
const rbac = require('./role.middleware');
const { getAllGrants, getListRole } = require('../repositories/role.repo');
const { getRoleNameByUserId } = require('../repositories/user.repo');
const { ForbiddenError } = require('../core/error.response');

const initAccessControl = async () => {
	try {
		const [grantAccess, roles] = await Promise.all([
			await getAllGrants(),
			await getListRole()
		]);
		rbac.setGrants(grantAccess);
		roles.forEach((role) => {
			if (role.parent && role.grants > 0) {
				rbac.grant(role.parent).extend(role.name);
			}
		});
	} catch (err) {
		console.error(err);
		throw new Error('initAccessControl error');
	}
};
const grantAccess = async (userId, action, resourse) => {
	const roleName = (await getRoleNameByUserId(userId)).usr_role.rol_slug;

	try {
		const permission = rbac.can(roleName)[action](resourse);
		if (!permission.granted) {
			throw new ForbiddenError(
				'You dont have permission to perform this action'
			);
		}
		return permission;
	} catch (err) {
		console.error(err);
		throw new ForbiddenError('you dont have permission to perform this action');
	}
};
/**
 * Checks if a user has permission to perform a specific action on a resource.
 *
 * @param {string} userId - The ID of the user.
 * @param {string} action - The action to be performed.
 * @param {string} resource - The resource on which the action is performed.
 * @returns {Promise<boolean|object>} - A promise that resolves to either the permission object if granted, or false if not granted.
 */
const checkPermission = async (userId, action, resourse) => {
	const roleName = (await getRoleNameByUserId(userId)).usr_role.rol_slug;
	const permission = await rbac.can(roleName)[action](resourse);
	return permission.granted ? permission : null;
};

module.exports = {
	grantAccess,
	checkPermission,
	initAccessControl
};
