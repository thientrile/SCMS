"use strict";
const {
	SuccessReponse,
	CREATED,
	OK
} = require('@core/success.response');
const { autoGenerateResource, updateOneResource } = require('../services/resource.service');

const AutoImportResource = async (req, res) => {
  new SuccessReponse({
    message: 'Resource was created successfully',
    metadata: await autoGenerateResource()
  }).send(req, res);
}
const updateResource=async (req,res)=>{
  new SuccessReponse({
    message: 'Resource was updated successfully',
    metadata: await updateOneResource(req.body)
  }).send(req, res);
}

module.exports = {AutoImportResource,updateResource};