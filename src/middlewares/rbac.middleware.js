/** @format */

'use strict';
const rbac = require('./role.middleware');

const {
	getAllGrants,
	getListRole,
	getRoleSlug
} = require('../repositories/role.repo');
const { ForbiddenError } = require('../core/error.response');
const { getRoleNameByUserId } = require('../repositories/user.repo');
const { filterConvert } = require('../utils');

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
// const grantAccess = async (userId, action, resourse) => {
// 	try {
// 		const roleName = (await getRoleNameByUserId(userId)).usr_role.rol_slug;
// 		const permission = rbac.can(roleName)[action](resourse);
// 		if (!permission.granted) {
// 			throw new ForbiddenError(
// 				'You dont have permission to perform this action'
// 			);
// 		}
// 		return permission;
// 	} catch (err) {
// 		initAccessControl();
// 		console.error(err);
// 		throw new ForbiddenError('you dont have permission to perform this action');
// 	}
// };
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
const grantsReq = (action, resourse) => {
	return async (req, res, next) => {
		try {
			if (!req.roleId) {
				throw new ForbiddenError(
					'You dont have permission to perform this action'
				);
			}

			const roleSlug = (await getRoleSlug(req.roleId)).rol_slug;
			if (!roleSlug) {
				throw new ForbiddenError(
					'You dont have permission to perform this action'
				);
			}
			const permission = rbac.can(roleSlug)[action](resourse);
			if (!permission.granted) {
				throw new ForbiddenError(
					'You dont have permission to perform this action'
				);
			}
			req.grants = permission;
			if (req.body) {
				req.body = filterConvert(req.body, req.grants);
			}
			next();
		} catch (err) {
			console.error(err);
			next(err);
		}
	};
};
module.exports = {
	// grantAccess,
	checkPermission,
	initAccessControl,
	grantsReq
};
