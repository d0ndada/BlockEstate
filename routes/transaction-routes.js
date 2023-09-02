const express = require("express");
const router = express.Router();
const {
  broadcast,
  getTransaction,
} = require("../controllers/transaction-controller");

router.route("/broadcast").post(broadcast);
// router.route("/commission").post();
router.route("/id/:id").get(getTransaction);

module.exports = router;
