"use strict";
const {
	SuccessReponse,
	CREATED,
	OK
} = require('../../../core/success.response');
const { autoGenerateResource } = require('../services/resource.service');

const AutoImportResource = async (req, res) => {
  new SuccessReponse({
    message: 'Resource was created successfully',
    metadata: await autoGenerateResource(req.user._id)
  }).send(res);
}
module.exports = {AutoImportResource};