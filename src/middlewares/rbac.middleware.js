/** @format */

'use strict';
const rbac = require('./role.middleware');

const {
	getAllGrants,
	getListRole,
	getRoleSlug
} = require('../models/repositories/role.repo');
const { ForbiddenError } = require('../core/error.response');
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
		throw new Error('initAccessControl error');
	}
};

const grantsAccess = (action, resourse) => {
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
	initAccessControl,
	grantsAccess
};
