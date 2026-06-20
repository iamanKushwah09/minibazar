const express = require('express');
const router = express.Router();
const catalogController = require('../controller/catalog.controller');
const { validateCatalog, validateCatalogId } = require('../validator/catalog.validator')

router.route('/')
  // .post(validateCatalog , catalogController.createCatalog)       
  .post(catalogController.createCatalog)
  .get(catalogController.getAllCatalog)
  .delete(catalogController.deleteAllCatalogs);

// router.route('/active')
//   .get(catalogController)        // Get a category by ID



router.route('/pdf_generator/combined')
  .get(catalogController.getCatalogData)




router.route('/:id')
  .get(catalogController.getCatalogById)
  .put(catalogController.updateCatalogById)
  .delete(catalogController.deleteCatalogById);
// router.route('/:id')
//   .get(validateCatalogId , catalogController.getCatalogById)        
//   .put(validateCatalog , catalogController.updateCatalogById)     
//   .delete(validateCatalogId , catalogController.deleteCatalogById);  





module.exports = router;


