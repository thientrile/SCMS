/** @format */

'use strict';
const { SuccessReponse, CREATED } = require('../../core/success.response');
const {
	signinup,
	login,
	handlerRefreshToken,
	logout
} = require('../../services/access/access.service');

const Register = async (req, res) => {
	new CREATED({
		message: 'Register was successfully',
		metadata: await signinup(req.body)
	}).send(res);
};
const Login = async (req, res) => {
	new SuccessReponse({
		message: 'Register was successfully',
		metadata: await login(req.body)
	}).send(res);
};
const Verify = async (req, res) => {
	new SuccessReponse({
		message: 'Verify was successfully',
		metadata: 1
	}).send(res);
};
const RefreshToken = async (req, res) => {
	new SuccessReponse({
		message: 'RefreshToken was successfully',
		metadata: await handlerRefreshToken(
			req.keyStore,
			req.user,
			req.refreshToken
		)
	}).send(res);
};
const Logout = async (req, res) => {
	new SuccessReponse({
		message: 'Logout was successfully',
		metadata: await logout(req.keyStore)
	}).send(res);
};
module.exports = {
	Register,
	Login,
	Verify,
	RefreshToken,
	Logout
};
