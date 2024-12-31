/** @format */

'use strict';

const cloudinary = require('cloudinary').v2;
const { cloudinaryConfig } = require('../configs/init.config');

cloudinary.config(cloudinaryConfig);
module.exports = cloudinary;
