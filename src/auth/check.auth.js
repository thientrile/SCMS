/** @format */

'use strict';
const headers = require('@utils/header');
const {
	AuthFailureError,
	NotAcceptableError,
	TooManyRequestsError
} = require('@core/error.response');
const { incr, getData, setData } = require('@database/redis.db');
const { createHmac } = require('node:crypto');
const { checkStatusMd } = require('@repositories/module.reop');
const { findGroupByCode } = require('@repositories/group.repo');
const { getIdBySlug } = require('@repositories/role.repo');
const { findApikey } = require('@repositories/apiKey.repo');
const apiKey = async (req, res, next) => {
	try {
		const key = req.headers[headers.API_KEY];
		if (!key) {
			throw new AuthFailureError(' Key is invalid');
		}
		const keyApp = `app:${key}`;
		const keyRedis = await getData(keyApp);
		if (keyRedis) {
			req.objKey = keyRedis;
			return next();
		}
		const apiKey = await findApikey({ app_code: key, app_status: true });
		if (!apiKey) {
			throw new AuthFailureError(' Key is invalid');
		}
		if (!apiKey.app_status) {
			throw new AuthFailureError(' Key is invalid');
		}
		await setData(keyApp, apiKey, 3600);

		req.objKey = apiKey;
	} catch (err) {
		return next(err);
	}
	next();
};
const Hmac = (req, res, next) => {
	try {
		const timestamp = req.headers[headers.TIMES];

		if (!timestamp) {
			throw new AuthFailureError('Timestamp is invalid');
		}
		const time = new Date().getTime();
		if (time - timestamp > 5000) {
			throw new AuthFailureError('Timestamp is invalid');
		}

		const reqBody = req.body || {};

		let body = timestamp + JSON.stringify(reqBody);

		req.on('data', (chunk) => {
			body += chunk;
		});
		req.on('end', () => {
			const hmac = req.headers[headers.HMAC];

			if (!hmac) {
				throw new AuthFailureError('Hmac is invalid');
			}
			const hash = createHmac('sha256', req.objKey._id.toString())
				.update(body)
				.digest('hex');

			if (hash !== hmac) {
				throw new AuthFailureError('Hmac is invalid');
			}
		});
	} catch (err) {
		return next(err);
	}
	next();
};
const permission = (permission) => {
	return async (req, res, next) => {
		try {
			if (!req.objKey.app_permissions) {
				return next(new NotAcceptableError(' Permission denied'));
			}
			const validPermissions = req.objKey.app_permissions.includes(permission);

			if (!validPermissions) {
				return next(new NotAcceptableError(' Permission denied'));
			}

			const checkMd = await getCheckMd(permission);			
			if (!checkMd) {
				req.roleId = await getRoleId();
				return next();
			}
			req.module = checkMd;
			req.group = await getGroup(checkMd, req.headers[headers.APPCODE]);
			return next();
		} catch (err) {
			return next(err);
		}
	};
};

const getCheckMd = async (permission) => {
	const keyMd = `md:${permission}`;
	let checkMd = await getData(keyMd);
	if (!checkMd) {
		checkMd = await checkStatusMd(permission);
		if (checkMd) {
			await setData(keyMd, checkMd, 60);
		}
	}
	return checkMd;
};

const getRoleId = async () => {
	let roleId = await getData(`publish:0`);
	if (!roleId) {
		roleId = (await getIdBySlug('1'))._id;
		await setData(`publish:0`, roleId, 3600);
	}
	return roleId;
};

const getGroup = async (checkMd, appCode) => {
	let group;
	if (checkMd.mds_isMgroup) {
		if (!appCode) {
			throw new NotAcceptableError('App code is invalid');
		}
		group = await getData(`group:${appCode}`);
		if (!group) {
			group = await findGroupByCode(appCode);
			await setData(`group:${appCode}`, group, 60);
		}
	} else {
		group = await getData(`group:${checkMd.mds_name}`);
		if (!group) {
			group = await findGroupByCode(checkMd.mds_name);
			await setData(`group:${checkMd.mds_name}`, group, 60);
		}
	}
	return group;
};
const limitReq = (limit) => {
	return async (req, res, next) => {
		const pathName = req._parsedUrl.pathname;
		const getIPUser =
			req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		const numberReq = await incr(`${getIPUser}:${pathName}`);
		if (numberReq > limit) {
			return next(new TooManyRequestsError('Too many requests'));
		}
		return next();
	};
};
module.exports = { apiKey, permission, limitReq, Hmac };
