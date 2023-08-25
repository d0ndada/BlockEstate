const express = require("express");
const router = express.Router();
const { getBlockchain } = require("../controllers/blockchain-controller");

router.route("/").get(getBlockchain);

module.exports = router;
