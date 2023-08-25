const express = require("express");
const router = express.Router();
const {
  getBlockchain,
  approveBlock,
} = require("../controllers/blockchain-controller");

router.route("/").get(getBlockchain);
router.route("/approve-block").get(approveBlock);

module.exports = router;
