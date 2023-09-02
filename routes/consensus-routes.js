const express = require("express");
const router = express.Router();
const { consensus } = require("../controllers/consensus-controller");

router.route("/").get(consensus);

module.exports = router;
