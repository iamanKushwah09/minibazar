const Role = require("../models/Role");
const { CREATE_MESSAGE, DELETE_MESSAGE, UPDATE_MESSAGE } = require("../enum")

const createRole = async (req, res) => {
    try {
        const newRole = new Role(req.body); // Use req.body for role data
        await newRole.save();
        return res.status(201).json({ message: `Role ${CREATE_MESSAGE}` }); // Respond with 201 Created
    } catch (error) {
        return res.status(500).json({ message: `Error creating role: ${error.message}` });
    }
};

const listRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        return res.status(200).json(roles); // Respond with 200 OK
    } catch (error) {
        return res.status(500).json({ message: `Error fetching roles: ${error.message}` });
    }
};

const deleteById = async (req, res) => {
    const { roleId } = req.params; // Get roleId from request parameters
    try {
        const deletedRole = await Role.findByIdAndDelete(roleId);
        if (!deletedRole) {
            return res.status(404).json({ message: `Role with ID ${roleId} not found` });
        }
        return res.status(200).json({ message: `Role ${DELETE_MESSAGE}` }); // Respond with 200 OK
    } catch (error) {
        return res.status(500).json({ message: `Error deleting role: ${error.message}` });
    }
};

const getRoleById = async (req, res) => {
    const { roleId } = req.params; // Get roleId from request parameters
    try {
        const role = await Role.findOne({ _id: roleId }); // Query by _id
        if (!role) {
            return res.status(404).json({ message: `Role with ID ${roleId} not found` });
        }
        const dataObject = role.permission.reduce((acc, item) => {
            // Check if the item is a Map and convert it to a plain object if necessary
            if (item instanceof Map) {
                item = Object.fromEntries(item);
            }
            const path = item.path;
            const permission = item.permission;
            if (path) {
                const key = path.split('/').filter(Boolean).pop();
                acc[key] = { path, permission };
            }
            return acc;
        }, {});
        role.permission = dataObject
        return res.status(200).json(role); // Respond with 200 OK
    } catch (error) {
        return res.status(500).json({ message: `Error fetching role by ID: ${error.message}` });
    }
};

const updateRole = async (req, res) => {
    const { roleId } = req.params; // Get roleId from request parameters
    const roleData = req.body; // Get role data from request body
    try {
        const updatedRole = await Role.findByIdAndUpdate(roleId, roleData, {
            new: true, // Return the updated document
            runValidators: true, // Ensure validation rules apply during update
        });
        if (!updatedRole) {
            return res.status(404).json({ message: `Role with ID ${roleId} not found` });
        }
        return res.status(200).json({ message: `Role ${UPDATE_MESSAGE}` }); // Respond with 200 OK
    } catch (error) {
        return res.status(500).json({ message: `Error updating role: ${error.message}` });
    }
};


const activeRole = async (req, res) => {
    try {
        const roles = await Role.find({ is_active: true });
        return res.status(200).json(roles); // Respond with 200 OK
    } catch (error) {
        return res.status(500).json({ message: `Error fetching roles: ${error.message}` });
    }
};


module.exports = {
    createRole,
    listRoles,
    deleteById,
    getRoleById,
    updateRole,
    activeRole
};
