const express = require("express");
const router = express.Router();
const {
  broadcastTransactions,
  acceptBidTransaction,
  createBid,
  createListing,
} = require("../controllers/transaction-controller");

router.route("/broadcast").post(broadcastTransactions);
router.route("/list").post(createListing);
router.route("/bid").post(createBid);
router.route("/accept").post(acceptBidTransaction);

// find info about transactions with id
// router.route("/list-property").post(createListing);
// router.route("/list-property").post(createListing);

module.exports = router;
