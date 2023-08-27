const Blockchain = require("../models/blockchain");
const { v4: uuidv4 } = require("uuid");

const blockEstate = new Blockchain();

const listing1 = blockEstate.createListingTransaction("tony", 100);
const listing2 = blockEstate.createListingTransaction("erik", 200);

blockEstate.addTransactionToPendingList(listing1);
// blockEstate.addTransactionToPendingList(listing2);

blockEstate.createBlock(1, "prevhash", "currenhash");
const bid1 = blockEstate.createBidTransaction(
  listing1.propertyId,
  "alice",
  110,
  "tony"
);
const bid2 = blockEstate.createBidTransaction(
  listing2.propertyId,
  "bob",
  210,
  "erik"
);

// Add these bids to the pendingList
blockEstate.addTransactionToPendingList(bid1);
// blockEstate.addTransactionToPendingList(bid2);

// Create a new block with these bids
blockEstate.createBlock(2, "prevhash2", "currenhash2");

// Accept a bid
const acceptedBid = blockEstate.acceptBidTransaction(
  bid1.transactionId,
  listing1.propertyId,
  "alice",
  110,
  "tony"
);

// Add the accepted bid to the pendingList
blockEstate.addTransactionToPendingList(acceptedBid);

// Create a new block with the accepted bid
blockEstate.createBlock(3, "prevhash3", "currenhash3");

console.log(blockEstate.chain);

const nodeAddress = uuidv4().split("-").join("");

module.exports = { blockEstate, nodeAddress };
