const express = require("express");
const router = express.Router();
const { consensus } = require("../controllers/consensus-routes");

router.route("/").get(consensus);

module.exports = router;
