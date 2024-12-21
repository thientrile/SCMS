/** @format */

'use strict';
const { AuthFailureError, ForbiddenError } = require('../core/error.response');
const JWT = require('jsonwebtoken');
const HEADERS = require('../utils/header');
const {
	deleteByClientId
} = require('../modules/access/services/keyToken.services');
const { tk_checkKeyTokenVerify } = require('../repositories/keyToken.repo');
const createTokenPair = async (payload, publicKey, privateKey) => {
	// accessToken
	const accessToken = await JWT.sign(payload, privateKey, {
		algorithm: 'RS256',
		expiresIn: '2 days',
		header: {
			typ: 'JWT',
			alg: 'RS256'
		}
	});

	const refreshToken = await JWT.sign(payload, privateKey, {
		algorithm: 'RS256',
		expiresIn: '7 days',
		header: {
			typ: 'JWT',
			alg: 'RS256'
		}
	});

	JWT.verify(accessToken, publicKey, (err) => {
		if (err) throw new AuthFailureError(' Invalid User');
	});
	return { accessToken, refreshToken };
};
const authertication = async (req, res, next) => {
	try {
		//check clientID
		const clientId = req.headers[HEADERS.CLIENT_ID];
		//get accecess token
		if (!clientId||clientId=='underfine') throw new AuthFailureError('Token has expired');
		let keyStore = (await tk_checkKeyTokenVerify(clientId))[0];
		if (!keyStore) throw new AuthFailureError('Token has expired');

		const userId = keyStore.tk_userId.valueOf();
		// verify refresh token
		const refreshToken = req.headers[HEADERS.REFRESHTOKEN];
		if (refreshToken) {
			if (keyStore.tk_refreshTokensUsed.includes(refreshToken)) {
				await deleteByClientId(clientId);
				throw new AuthFailureError('Refresh Token has expired');
			}
			return JWT.verify(refreshToken, keyStore.tk_publicKey, (err, decoded) => {
				if (err) {
					throw new AuthFailureError('Refresh Token has expired');
				}
				if (userId !== decoded._info._id) {
					throw new AuthFailureError(' Invalid User ');
				}
				req.keyStore = keyStore;
				req.user = decoded._info;
				req.refreshToken = refreshToken;

				if (req.group) {
					const member = req.group.grp_members.find(
						(member) => member.userId == decoded._info._id
					);
					if (!member) throw new AuthFailureError(' Invalid User');
					req.roleId = member.roleId;
				}
				next();
			});
		}

		// verify acccesstoken
		const accessToken = req.headers[HEADERS.AUTHORIZATION];
		if (!accessToken) throw new AuthFailureError('Invalid Token');

		return JWT.verify(accessToken, keyStore.tk_publicKey, (err, decoded) => {
			if (err) {
				throw new AuthFailureError(' Token has expired');
			}

			if (userId !== decoded._info._id)
				throw new AuthFailureError(' Invalid User');
			req.keyStore = keyStore;
			req.user = decoded._info;
			if (req.group) {
				const member = req.group.grp_members.find(
					(member) => member.userId == decoded._info._id
				);
				if (!member) throw  new ForbiddenError(
					'You dont have permission to perform this action'
				);

				req.roleId = member.roleId;
			}
			next();
		});
	} catch (err) {
		return next(err);
	}
};

module.exports = { createTokenPair, authertication };
