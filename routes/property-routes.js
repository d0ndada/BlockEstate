const express = require("express");
const router = express.Router();
const {
  sold,
  status,
  activeListings,
  recordListings,
  historyProperty,
  ongoingBids,
  biddings,
} = require("../controllers/property-controller");

router.route("/status/:id").get(status);
router.route("/ongoingBids/:id").get(ongoingBids);
router.route("/history/:id").get(historyProperty);
router.route("/sold").get(sold);
router.route("/listed/record").get(recordListings);
router.route("/listed/live").get(activeListings);
router.route("/biddings").get(biddings);

module.exports = router;
