/** @format */

const { getData } = require('../database/redis.db');

const asyncHandler = (fn) => {
	return async (req, res, next) => {
		// save cache key for get data have method is GET
		if (req.method === 'GET') {
			const cacheKey = `${req.method}:${req.user._id || 1}:${
				req.originalUrl
			}:${JSON.stringify(req.query)}`;

			req.cacheKey = cacheKey;
			const reslult = await getData(req.cacheKey);
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
