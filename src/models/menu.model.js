/** @format */

'use strict';

const { Schema, model } = require('mongoose');
const documentName = 'Menu';
const collectionName = 'Menus';
const menuSchema = new Schema(
	{
		men_moduleId: {
			type: Schema.Types.ObjectId,
			ref: 'Module'
		},

		men_arr: {
			type: Array,
			default: []
		}
	},
	{
		timestamps: true,
		collection: collectionName
	}
);
module.exports = model(documentName, menuSchema);
