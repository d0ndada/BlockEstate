const express = require("express");
const router = express.Router();
const { addBlock, getLastBlock } = require("../controllers/block-controller");

router.route("/").post(addBlock);
router.route("/last-block").post(getLastBlock);

module.exports = router;
