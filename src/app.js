/** @format */

'use script';
const fs = require('fs');
require('module-alias/register');
const options = {
	key: fs.readFileSync('./src/key.pem', 'utf8'),
	cert: fs.readFileSync('./src/cert.pem', 'utf8')
};
const corsOptions = require('@utils/cors');
const cors = require('cors');
require('dotenv').config();
const express = require('express');
const app = express();
const Server = require('https').createServer(options, app);
const io = require('socket.io')(Server);
const { randomUUID } = require('crypto');
const morgan = require('morgan');
const { default: helmet } = require('helmet');
const compression = require('compression');
const HEADERS = require('@utils/header');

// init db
// init mongodb
require('@configs/mongoDB.config');

// init redis
const initRedis = require('@configs/redis.config');
initRedis.init();

// init elasticsearch
const Elasticsearch = require('@configs/elasticSearch.config.js');
const mylogger = require('@loggers/mylogger.log.js');

Elasticsearch.init();

// init middleware
app.use(cors(corsOptions));
app.use(morgan('combined'));
app.use(helmet());
app.use(compression());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// init logger
app.use((req, res, next) => {
	// create requestId
	const requestId = req.headers[HEADERS.CLIENT_ID] || randomUUID();
	// set requestId to req
	req.requestId = requestId;
	mylogger.log(`get info request::${req.method}`, [
		req.path,
		{ requestId },
		req.method === 'POST' ? req.body : req.query
	]);
	next();
});

// router
app.use('', require('./routers.js'));

// #function middleware error
app.use((req, res, next) => {
	const error = new Error('Not Found');
	error.status = 404;
	next(error);
});

// # error management function
app.use((error, req, res, next) => {
	const statusCode = error.status || 500;
	// handle log error
	const reqError = `${statusCode}::${
		Date.now() - error.now
	}ms::Response${JSON.stringify(error)}`;
	mylogger.error(reqError, [
		req.path,
		{ requestId: req.requestId },
		{
			error: error.message
		}
	]);
	console.log('error::', error);
	return res.status(statusCode).json({
		status: 'Error',
		code: statusCode,
		message: error.message || 'Internal Server Error'
	});
});

module.exports = { Server };
