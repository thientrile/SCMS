/** @format */

'use strict';

const {
	setGrantsToRole,
	resourceList,
	delGrantstoRole,
	createResource,
	createRoleRoot,
	deleteRole,
	addGrantsToRole,
	getListAllRole
} = require('../services/rbac.service');
const {
	SuccessReponse,
	CREATED,
	OK
} = require('@core/success.response');
const { deleteResource } = require('../services/resource.service');
const SetGrants = async (req, res) => {
	new SuccessReponse({
		message: 'Grant was updated successfully',
		metadata: await setGrantsToRole(req.body)
	}).send(req, res);
};
const GetResources = async (req, res) => {
	const { totalCount, paginatedResults } = await resourceList(req.query);
	new OK({
		message: 'Resources was fetched successfully',
		metadata: paginatedResults,
		options: { ...req.query, size: totalCount }
	}).send(req, res);
};
const GetRoles = async (req, res) => {
	new OK({
		message: 'Roles was fetched successfully',
		metadata: await getListAllRole()
	}).send(req, res);
};
const DelGrant = async (req, res) => {
	new SuccessReponse({
		message: 'Grant was deleted successfully',
		metadata: await delGrantstoRole(req.body)
	}).send(req, res);
};
const CreateResource = async (req, res) => {
	new CREATED({
		message: 'Resource was created successfully',
		metadata: await createResource(req.body)
	}).send(req, res);
};
const CreateRole = async (req, res) => {
	new CREATED({
		message: 'Roles was fetched successfully',
		metadata: await createRoleRoot(req.body)
	}).send(req, res);
};
const Delrole = async (req, res) => {
	new SuccessReponse({
		message: 'Role was deleted successfully',
		metadata: await deleteRole(req.body)
	}).send(req, res);
};
const DelReource = async (req, res) => {
	new SuccessReponse({
		message: 'Resource was deleted successfully',
		metadata: await deleteResource(req.body)
	}).send(req, res);
};
const AddGrants = async (req, res) => {
	new SuccessReponse({
		message: 'Resource was deleted successfully',
		metadata: await addGrantsToRole(req.body)
	}).send(req, res);
};
module.exports = {
	SetGrants,
	GetResources,
	GetRoles,
	DelGrant,
	CreateResource,
	CreateRole,
	Delrole,
	DelReource,
	AddGrants
};
