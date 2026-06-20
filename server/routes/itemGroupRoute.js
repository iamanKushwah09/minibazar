const express = require("express");
const {getShowingCategory} = require("../controller/itemGroupController.js");

const router = express.Router();

router.route("/show")
  .get(getShowingCategory); // Get only showing item groups


module.exports = router;