/** @format */

'use strict';

const groupModel = require('../group.model');

const findGroupByCode = async (code) => {
	return groupModel.findOne({ grp_code: code, grp_isActive: true });
};

module.exports = {
  findGroupByCode
}