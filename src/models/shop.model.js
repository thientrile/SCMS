/** @format */

'use strict';
const { model, Schema } = require('mongoose');
const { randomId } = require('../utils');
const documentName = 'Shop';
const collectionName = 'Shops';
const shopSchema = new Schema(
	{
		shp_userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		shp_avatar: {
			type: String,
			default: ''
		},
		shp_code: {
			type: String,
			required: true,
			unique: true
		},
		shp_name: {
			type: String,
			required: true,
			unique: true
		},
		shp_description: {
			type: String,
			required: true
		},
		shp_status: {
			type: String,
			enum: ['active', 'inactive', 'pending'],
			default: 'active'
		},
		shp_verify: {
			type: Boolean,
			default: false
		},
		shp_type: {
			type: String,
			enum: ['single', 'multi'],
			default: 'single'
		},
		shp_slug: {
			type: String,
			unique: true
		}
	},
	{
		timestamps: true,
		collection: collectionName
	}
);
shopSchema.pre('save', function (next) {
	this.shp_slug = `shopui${randomId()}`;

	next();
});
module.exports = model(documentName, shopSchema);
