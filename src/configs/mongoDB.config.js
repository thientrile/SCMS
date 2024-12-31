/** @format */

'use strict';

const mongoose = require('mongoose');
const { countConnect } = require('../helpers/checkConnect.helpers');
const { db } = require('./init.config');
const { initAccessControl } = require('../middlewares/rbac.middleware');
let type = 'local';
const { schema, username, password, name, host } = db.mongo[type].connect;
let url = `${schema}://${username}:${password}@${host}/${name}`;
if (!username || !password) {
	url = `${schema}://${host}/${name}`;
}


class DatabaseClass {
	constructor() {
		this.connect();
	}
	async connect() {
		mongoose
			.connect(url, db.mongo[type].option)

			.then((_) => {
				initAccessControl();
				console.log(`connecting mongoDB - connecting Status: Connnected`);
				countConnect();
				clearTimeout(this.ErrorTimeOut);
			})
			.catch((_) => {
				console.error('Error Connect', _);
				console.error('Automatically connect after 5 seconds');
				this.ErrorTimeOut = setTimeout(() => {
					this.connect();
				}, 5000);
			});
	}
	static getInstance() {
		if (!DatabaseClass.instance) {
			DatabaseClass.instance = new DatabaseClass();
		}
		return DatabaseClass.instance;
	}
}
const instanceMongoDB = DatabaseClass.getInstance();
module.exports = instanceMongoDB;
