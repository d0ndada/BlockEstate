const express = require("express");
const router = express.Router();
const {
  broadcast,
  getTransaction,
  transaction,
} = require("../controllers/transaction-controller");

router.route("/broadcast").post(broadcast);
router.route("/broadcast-transaction").post(transaction);
router.route("/:id").get(getTransaction);

module.exports = router;
