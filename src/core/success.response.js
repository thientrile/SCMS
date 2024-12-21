/** @format */

'use strict';
const { setData } = require('../database/redis.db');
const { filterConvert } = require('../utils');
const { StatusCodes, ReasonPhrases } = require('../utils/HttpStatusCode');

class SuccessReponse {
	constructor({
		message,
		statusCode = StatusCodes.OK,
		reasonStatusCode = ReasonPhrases.OK,
		metadata = {}
	}) {
		this.message = !message ? reasonStatusCode : message;
		this.status = statusCode;

		this.metadata = metadata;
	}

	send(req, res, headers = {}) {
		Object.entries(headers).forEach(([key, value]) => {
			res.setHeader(key, value);
		});
		// filter metadata for grants
		if (req.grants) {
			this.metadata = filterConvert(this.metadata, req.grants);
		}
		// save cache key for get data have method is GET
		if (req.cacheKey && this.status < 400) {
			setData(req.cacheKey, this, 60);
		}
		return res.status(this.status).json(this);
	}
	grants(res, grants, headers = {}) {
		Object.entries(headers).forEach(([key, value]) => {
			res.setHeader(key, value);
		});
		this.metadata = filterConvert(this.metadata, grants);

		return res.status(this.status).json(this);
	}
}

class OK extends SuccessReponse {
	constructor({ message, metadata }) {
		super({ message, metadata });
	}
}
class CREATED extends SuccessReponse {
	constructor({
		options = {},
		message,
		statusCode = StatusCodes.CREATED,
		reasonStatusCode = ReasonPhrases.CREATED,
		metadata
	}) {
		super({ message, statusCode, reasonStatusCode, metadata });
		this.options = options;
	}
}
// class SuccessReponse extends suc
module.exports = {
	OK,
	CREATED,
	SuccessReponse
};
