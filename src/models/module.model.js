/** @format */

'use strict';

const { Schema, model } = require('mongoose');
const documentName = 'Module';
const collectionName = 'Modules';
const moduleSchema = new Schema(
	{
		mds_name: {
			type: String,
			required: true
		},
		mds_id: {
			type: Number,
			required: true,
			unique: true
		},
		mds_isMgroup: {
			type: Boolean,
			default: true
		},
		mds_isActive: {
			type: Boolean,
			default: true
		},
		mds_cf_file: {
			type: String,
			default: null
		},
		mds_menu: {
			type: Array,
			default: []
		},

		mds_df_roleId: {
			type: Schema.Types.ObjectId,
			ref: 'Role'
		}
	},
	{
		timestamps: true,
		collection: collectionName
	}
);
module.exports = model(documentName, moduleSchema);
