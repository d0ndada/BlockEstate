const express = require("express");
const router = express.Router();
const {
  broadcast,
  getTransaction,
  transaction,
} = require("../controllers/transaction-controller");

router.route("/broadcast").post(broadcast);
// making it possibly to broadcast on every post to other nodes directly
router.route("/transaction").post(transaction);
router.route("/:id").get(getTransaction);

module.exports = router;
