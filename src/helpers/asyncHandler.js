/** @format */

const { getData } = require('../database/redis.db');
const createCacheKey = (query) => {
	return Object.keys(query)
		.sort((a, b) => a.localeCompare(b))
		.map((key) => `${key}=${query[key]}`)
		.join('&')
		.replace(/[:{}]/g, '=')
		.replace(/,/g, '')
		.trim();
};
const asyncHandler = (
	fn,
	options = {
		redis: false,
		timeSetcache: 30
	}
) => {
	return async (req, res, next) => {
		// save cache key for get data have method is GET
		req.options = options;
		if (req.method === 'GET' && options.redis) {
			req.options.keycache = `${req.method}:${req.user._id || 1}:${
				req.originalUrl
			}:${createCacheKey(req.query)}`;
			const reslult = await getData(req.options.keycache);
			if (reslult) {
				return res.status(reslult.status).json(reslult);
			}
		}

		fn(req, res, next).catch(next);
	};
};
module.exports = {
	asyncHandler
};
