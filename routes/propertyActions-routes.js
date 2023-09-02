const express = require("express");
const router = express.Router();
const {
  acceptBid,
  createBid,
  listProperty,
  relistProperty,
} = require("../controllers/propertyActions-controller");

router.route("/list").post(listProperty);
router.route("/bid").post(createBid);
router.route("/acceptBid").post(acceptBid);
router.route("/relist").post(relistProperty);
// add delete have it in testing but not an endpoint************

module.exports = router;
