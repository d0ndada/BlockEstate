const express = require("express");
const router = express.Router();
const { block, findBlock } = require("../controllers/block-controller");

router.route("/").post(block);
router.route("/:hash").get(findBlock);

module.exports = router;
