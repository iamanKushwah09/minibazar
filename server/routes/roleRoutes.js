const express = require("express");
const router = express.Router();
const {
    createRole,
    listRoles,
    deleteById,
    getRoleById,
    updateRole,
    activeRole
} = require("../controller/roleController");

// Define routes for roles
router.route('/')
    .post(createRole)          // Create a new role
    .get(listRoles);           // Retrieve all roles

router.get('/active' , activeRole);           // Retrieve all roles


router.route('/:roleId')
    .get(getRoleById)          // Get a role by ID
    .put(updateRole)           // Update a role by ID
    .delete(deleteById);       // Delete a role by ID



module.exports = router;
