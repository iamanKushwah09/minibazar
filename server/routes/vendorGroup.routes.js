const express = require('express');
const router = express.Router();
const vendorGroupController = require('../controller/vendorGroup.controller');
const { validateVendorGroup , validateVendorGroupId } = require('../validator/vendorgroup.validator')



router.route('/refresh').get(vendorGroupController.getBusyRefreshData)

router.route('/')
    .post(validateVendorGroup , vendorGroupController.createVendorGroup)
    .get(vendorGroupController.getAllVendorGroups)
    .delete(vendorGroupController.deleteAllVendorGroups);

router.route('/active')
    .get(vendorGroupController.getActive)

router.route('/:id')
    .get(validateVendorGroupId , vendorGroupController.getVendorGroupById)
    // .put(validateVendorGroup , vendorGroupController.updateVendorGroupById)
    .put( vendorGroupController.updateVendorGroupById)
    .delete(validateVendorGroupId , vendorGroupController.deleteVendorGroupById);

module.exports = router;
