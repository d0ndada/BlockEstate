const express = require("express");
const router = express.Router();
const {
  addNode,
  addNodes,
  broadcastNode,
} = require("../controllers/node-controllers");

router.route("/register-node").post(addNode);
router.route("/register-nodes").post(addNodes);
router.route("/register-broadcast-node").post(broadcastNode);

module.exports = router;
