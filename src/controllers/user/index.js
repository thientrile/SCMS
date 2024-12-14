/** @format */

'use strict';

const { SuccessReponse } = require('../../core/success.response');
const { getUserInfo } = require('../../services/user.service');

const UserInfo = async (req, res) => {
	new SuccessReponse({
		message: 'User info was successfully',
		metadata: await getUserInfo(req.user._id)
	}).send(res);
};
module.exports = {
	UserInfo
};
