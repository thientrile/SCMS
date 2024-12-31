/** @format */

'use strict';

const development = {
	app: {
		port: process.env.DEV_APP_PORT || 3055,
		name: process.env.DEV_API_NAME || 'Dev.SCMS',
		version: process.env.DEV_API_VERSION || 'V1'
	},
	db: {
		mongo: {
			cloud: {
				connect: {
					schema: 'mongodb+srv',
					username: encodeURIComponent('tori'),
					password: encodeURIComponent('Tori@12345'),
					host: 'cluster0.tsw4h.mongodb.net',
					name: 'shopDev'
				},
				option: {
					retryWrites: true,
					w: 'majority'
				}
			},

			local: {
				connect: {
					schema: 'mongodb',
					username: '',
					password: '',
					host: process.env.APP_HOST
						? `${process.env.APP_HOST}:27017`
						: 'mongodb:27017',
					name: 'SCMS'
				},
				option: {}
			}
		},
		redis: {
			host: process.env.APP_HOST ? `${process.env.APP_HOST}` : 'redis',
			port: 6379
		},
		es: {
			node: process.env.APP_HOST ? `http://${process.env.APP_HOST}:9200` : 'http://es:9200',
			auth: {
				username: 'elastic',
				password: 'c95Xs2ObdDTvPdn-AuWF'
			},
			tls: {
				rejectUnauthorized: false
			}
		}
	},
	cloudinary: {
		cloud_name: 'dcplqohwd',
		api_key: '945292861993721',
		api_secret: 'J_ohAUV8PvwaiqTlha3ho0YZ4u4'
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
