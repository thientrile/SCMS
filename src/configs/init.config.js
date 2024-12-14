/** @format */

'use strict';

const development = {
	app: {
		port: process.env.DEV_APP_PORT || 3055,
		name: process.env.DEV_API_NAME || 'dev-api',
		version: process.env.DEV_API_VERSION || 'V1'
	},
	db: {
		mongo: {
			schema: process.env.MONGO_SCHEMA,
			username: encodeURIComponent(process.env.MONGO_USERNAME),
			password: encodeURIComponent(process.env.MONGO_PASSWORD),
			host: process.env.MONGO_HOST,
			name: process.env.MONGO_DB_NAME
		},
		redis: {
			host: 'localhost',
			port: 6379
		}
	}
};

const pro = {
	app: {
		port: process.env.PRO_AP_PORT || 3000,
		name: process.env.PRO_API_NAME || 'pro-api',
		version: process.env.PRO_API_VERSION || 'V1'
	},
	db: {
		host: process.env.PRO_DB_HOST || 'localhost',
		port: process.env.PRO_DB_PORT || '27017',
		name: process.env.PRO_DB_NAME || 'shopPro'
	}
};
const config = { pro, development };
const env = process.env.NODE_ENV || 'development';

module.exports = config[env];
