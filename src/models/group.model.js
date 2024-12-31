/** @format */

'use strict';
const { Schema, model } = require('mongoose');
const documentName = 'Group';
const collectionName = 'Groups';
const groupSchema = new Schema(
	{
		grp_name: {
			type: String,
			required: true
		},
		grp_info: {
			type: Schema.Types.Mixed,
			default: {}
		},
		grp_code: {
			type: String,
			required: true,
			unique: true
		},
		grp_id: {
			type: Number,
			required: true,
			unique: true
		},
		grp_moduleId: {
			type: Schema.Types.ObjectId,
			ref: 'Module'
		},
		grp_isActive: {
			type: Boolean,
			default: true
		},
		grp_members: [
			{
				roleId: {
					type: Schema.Types.ObjectId,
					ref: 'Role'
				},
				userId: {
					type: Schema.Types.ObjectId,
					ref: 'User'
				}
			}
		]
	},
	{
		timestamps: true,
		collection: collectionName
	}
);
module.exports = model(documentName, groupSchema);
