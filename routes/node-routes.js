const express = require("express");
const router = express.Router();
const {
  addNode,
  broadcastNode,
  addNodes,
} = require("../controllers/node-controller");

router.route("/broadcast").post(broadcastNode);
router.route("/register-node").post(addNode);
router.route("/register-nodes").post(addNodes);

module.exports = router;
