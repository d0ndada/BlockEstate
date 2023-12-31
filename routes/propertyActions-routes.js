const express = require("express");
const router = express.Router();
const {
  acceptBid,
  createBid,
  listProperty,
  relistProperty,
  deleteListing,
} = require("../controllers/propertyActions-controller");

router.route("/list").post(listProperty);
router.route("/bid").post(createBid);
router.route("/acceptBid").post(acceptBid);
router.route("/relist").post(relistProperty);
router.route("/deleteListing").post(deleteListing);

module.exports = router;
