/** @format */

'use strict';

const {
	setGrantsToRole,
	resourceList,
	delGrantstoRole,
	createResource,
	createRoleRoot,
	deleteRole,
	addGrantsToRole
} = require('../services/rbac.service');
const {
	SuccessReponse,
	CREATED,
	OK
} = require('../../../core/success.response');
const { getAllListRole } = require('../services/rbac.service');
const { deleteResource } = require('../services/resource.service');
const SetGrants = async (req, res) => {
	new SuccessReponse({
		message: 'Grant was updated successfully',
		metadata: await setGrantsToRole(req.user._id, req.body)
	}).send(res);
};
const GetResources = async (req, res) => {
	new OK({
		message: 'Resources was fetched successfully',
		metadata: await resourceList(req.user._id, req.query),
		options: req.query
	}).send(res);
};
const GetRoles = async (req, res) => {
	new OK({
		message: 'Roles was fetched successfully',
		metadata: await getAllListRole(req.user._id)
	}).send(res);
};
const DelGrant = async (req, res) => {
	new SuccessReponse({
		message: 'Grant was deleted successfully',
		metadata: await delGrantstoRole(req.user._id, req.body)
	}).send(res);
};
const CreateResource = async (req, res) => {
	new CREATED({
		message: 'Resource was created successfully',
		metadata: await createResource(req.user._id, req.body)
	}).send(res);
};
const CreateRole = async (req, res) => {
	new CREATED({
		message: 'Roles was fetched successfully',
		metadata: await createRoleRoot(req.user._id,req.body)
	}).send(res);
};
const Delrole = async (req, res) => {
	new SuccessReponse({
		message: 'Role was deleted successfully',
		metadata: await deleteRole(req.user._id, req.body)
	}).send(res);
};
const DelReource= async (req,res)=>{
  new SuccessReponse({
    message: 'Resource was deleted successfully',
    metadata: await deleteResource(req.user._id, req.body)
  }).send(res);
}
const AddGrants=async (req,res)=>{
	new SuccessReponse({
    message: 'Resource was deleted successfully',
    metadata: await  addGrantsToRole(req.user._id, req.body)
  }).send(res);
}
module.exports = {
	SetGrants,
	GetResources,
	GetRoles,
	DelGrant,
	CreateResource,
	CreateRole,
	Delrole,
  DelReource,
	AddGrants,
};
