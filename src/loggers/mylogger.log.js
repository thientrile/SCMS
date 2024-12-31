/** @format */

const { format, createLogger, transports } = require('winston');
require('winston-daily-rotate-file');
const { combine, timestamp, align, printf, colorize } = format;
/* 
level: ['info','error','warning','debug','silly'],

*/
class Mylogger {
	constructor() {
		const formatPrint = printf(
			({ level, message, context, requestId, timestamp, metadata }) => {
				return `${timestamp.toString()}::${level}::${context}::${requestId}::${message}::${JSON.stringify(
					metadata
				)}`;
			}
		);
		this.logger = createLogger({
			format: combine(
				timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
				formatPrint
			),
			transports: [
				new transports.Console(),
				new transports.DailyRotateFile({
					level: 'info',
					filename: 'application-%DATE%.info.log',
					dirname: 'src/logs/%DATE%',
					datePattern: 'YYYY-MM-DD-HH',
					zippedArchive: true, // if set equal true, the file will be zipped
					maxSize: '20m', // size file log
					maxFiles: '14d', // if set maxFiles, the file will be deleted after 14 days
					format: combine(
						timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
						formatPrint
					)
				}),
				new transports.DailyRotateFile({
					level: 'error',
					filename: 'application-%DATE%.error.log',
					dirname: 'src/logs/%DATE%',
					datePattern: 'YYYY-MM-DD-HH',
					zippedArchive: true, // if set equal true, the file will be zipped
					maxSize: '20m', // size file log
					maxFiles: '14d', // if set maxFiles, the file will be deleted after 14 days
					format: combine(
						timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
						formatPrint
					)
				})
			]
		});
	}
	commonParms(params) {
		let context, req, metadata;
		if (!Array.isArray(params)) {
			context = params;
		} else {
			[context, req, metadata] = params;
		}
		const requestId = req ? req.requestId : '';
		return {
			requestId,
			context,
			metadata
		};
	}
	log(message, params) {
		const paramLog = this.commonParms(params);
		const logObject = Object.assign(
			{
				message
			},
			paramLog
		);
		this.logger.info(logObject);
	}
	error(message, params) {
		const paramLog = this.commonParms(params);
		const logObject = Object.assign(
			{
				message
			},
			paramLog
		);
		this.logger.error(logObject);
	}
}
module.exports = new Mylogger();
