/** @format */

'use strict';
const bcrypt = require('bcrypt');
const userModel = require('@models/user.model');
const {
	isValidation,
	getErrorMessageMongose,

	addPrefixToKeys,
	randomId,
	generatedKey,
	removePrefixFromKeys
} = require('@utils/index');
const { ForbiddenError, AuthFailureError } = require('@core/error.response');
const {
	createKeyToken,
	deleteByClientId,
	findByClientId,
	updateById
} = require('./keyToken.services');
const { createTokenPair } = require('@auth/utils.auth');
const {
	userDeleteById,
	userFindByusername
} = require('@models/repositories/user.repo');
const Joi = require('joi');

// refetch token
/**
 * Handles the refresh token logic.
 *
 * @param {Object} keyStore - The key store object.
 * @param {Object} user - The user object.
 * @param {string} refreshToken - The refresh token.
 * @returns {Promise<Object>} - A promise that resolves to an object containing uniqueId, username, and tokens.
 * @throws {AuthFailureError} - Throws an AuthFailureError if the refresh token has expired.
 */
const handlerRefreshToken = async (keyStore, user, refreshToken) => {
	const key = await findByClientId(keyStore.tkn_clientId);

	const publicKey = key.tkn_publicKey;
	const privateKey = key.tkn_privateKey;
	const [tokens] = await Promise.all([
		createTokenPair({ _info: user }, publicKey, privateKey),
		updateById(key._id, {
			$push: {
				tkn_refreshTokensUsed: refreshToken // Mark as used,
			}
		})
	]);

	return {
		uniqueId: key.tkn_clientId,
		tokens
	};
};

//login user
/**
 * Logs in a user with the provided username and password.
 * @param {Object} credentials - The user's login credentials.
 * @param {string} credentials.username - The username of the user.
 * @param {string} credentials.password - The password of the user.
 * @returns {Promise<Object>} A promise that resolves to an object containing the uniqueId, username, and tokens of the logged-in user.
 * @throws {AuthFailureError} If the user is not found or the password is incorrect.
 * @throws {AuthFailureError} If there is an error creating the token pair or saving the key token.
 * @throws {AuthFailureError} If there is an error deleting the user after a failed login attempt.
 */
const login = async ({ username, password }) => {
	const user = await userFindByusername(username);
	if (!user) {
		throw new AuthFailureError(' User is not signin');
	}
	const comparePassword = await bcrypt.compare(password, user.usr_salt);
	if (!comparePassword) {
		throw new AuthFailureError(' Password is not correct');
	}

	const { publicKey, privateKey } = generatedKey();

	//create token pair
	const _info = removePrefixFromKeys(user, 'usr_');
	const [result, tokens] = await Promise.all([
		createKeyToken({
			userId: user._id,
			publicKey: publicKey,
			privateKey
		}),
		createTokenPair(
			{
				_info
			},
			publicKey.toString(),
			privateKey
		)
	]);
	if (!result) {
		throw new AuthFailureError(' Unable to login account');
	}

	return {
		uniqueId: result.clientId,
		tokens
	};
};
// Sign Up user
/**
 * Signs up a user with the provided information.
 *
 * @param {Object} options - The user information.
 * @param {string} options.name - The name of the user.
 * @param {string} options.sex - The sex of the user.
 * @param {string} options.date - The date of birth of the user.
 * @param {string} options.username - The username, email, or phone number of the user.
 * @param {string} options.password - The password of the user.
 * @param {string} options.role - The role of the user.
 * @returns {Promise<Object>} A promise that resolves to an object containing the uniqueId, username, and tokens of the created user.
 * @throws {ForbiddenError} If the username or email or phone number already exists.
 * @throws {AuthFailureError} If unable to create the account.
 */
const signinup = async (payload) => {
	// hash the password
	payload.id = parseInt(randomId());
	const passwordHash = await bcrypt.hash(payload.password, 10);

	// check type username
	payload.salt = passwordHash;
	let userData = addPrefixToKeys(payload, 'usr_');
	if (payload.username) {
		const { username } = payload;
		if (isValidation.isEmail(username)) {
			userData.usr_email = username;
		} else if (isValidation.isPhoneNumber(username)) {
			userData.usr_phone = username;
		} else {
			userData.usr_slug = username;
		}
	}

	const user = await userModel.create(userData).catch((err) => {
		throw new ForbiddenError(
			getErrorMessageMongose(
				err,

				' Username or email or phone number already exists'
			)
		);
	});
	//create public key and private key

	const { publicKey, privateKey } = generatedKey();
	const _info = removePrefixFromKeys(user.toObject(), 'usr_');
	const [result, tokens] = await Promise.all([
		createKeyToken({
			userId: user._id,
			publicKey,
			privateKey
		}),
		createTokenPair(
			{
				_info
			},
			publicKey.toString(),
			privateKey
		)
	]);
	if (!result) {
		userDeleteById(user._id);
		throw new AuthFailureError(' Unable to create account');
	}
	return {
		uniqueId: result.clientId,
		tokens
	};
};
// logout
const logout = async (keyStore) => {
	return await deleteByClientId(keyStore.tkn_clientId)
		.then(() => 1)
		.catch(() => {
			throw new AuthFailureError(' Unable to logout account');
		});
};

const joiAccess = {
	signinup: Joi.object({
		name: Joi.string().min(3).max(30).required(),
		password: Joi.string().min(8).max(30).required(),
		email: Joi.string().email().required(),
		sex: Joi.string(),
		date_of_birth: Joi.date().required()
	}),
	login: Joi.object({
		username: Joi.string().required(),
		password: Joi.string().required()
	})
};

module.exports = { joiAccess, signinup, login, handlerRefreshToken, logout };
