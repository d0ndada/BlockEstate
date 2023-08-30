const Blockchain = require("../models/blockchain");
const { v4: uuidv4 } = require("uuid");

const blockEstate = new Blockchain();
const nodeAddress = uuidv4().split("-").join("");

const listing1 = blockEstate.createListingTransaction("tony", 100);
const listing2 = blockEstate.createListingTransaction("erik", 200);

// blockEstate.addTransactionToPendingList(listing1);
blockEstate.addTransactionToPendingList(listing2);

blockEstate.createBlock(1, "prevhash", "currenhash");
const bid1 = blockEstate.createBidTransaction(
  listing2.propertyId,
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
// blockEstate.addTransactionToPendingList(bid1);
blockEstate.addTransactionToPendingList(bid2);

// Create a new block with these bids
blockEstate.createBlock(2, "prevhash2", "currenhash2");
blockEstate.addTransactionToPendingList(bid1);
blockEstate.createBlock(3, "prevhash2", "currenhash2");

// Accept a bid
const acceptedBid = blockEstate.acceptBidTransaction(
  bid2.transactionId,
  listing2.propertyId,
  "alice",
  110,
  "tony"
);

// Add the accepted bid to the pendingList
blockEstate.addTransactionToPendingList(acceptedBid);

// Create a new block with the accepted bid
blockEstate.createBlock(4, "prevhash3", "currenhash3");
blockEstate.addTransactionToPendingList(listing1);
blockEstate.createBlock(5, "prevhash4", "currenthash4");

const bid3 = blockEstate.createBidTransaction(
  listing1.propertyId,
  "bob",
  210,
  "erik"
);
blockEstate.addTransactionToPendingList(bid3);
blockEstate.createBlock(6, "prevhash5", "currenthash5");

const accept = blockEstate.acceptBidTransaction(
  bid3.transactionId,
  listing1.propertyId,
  "alice",
  110,
  "tony"
);
blockEstate.addTransactionToPendingList(accept);
blockEstate.createBlock(6, "prevhas4", "gg4");
const listing3 = blockEstate.createListingTransaction("susan", 300);
blockEstate.addTransactionToPendingList(listing3);
blockEstate.createBlock(7, "prevhash6", "currenhash6");

// 2. Properties with multiple bids but none accepted
const listing4 = blockEstate.createListingTransaction("mike", 400);
blockEstate.addTransactionToPendingList(listing4);
blockEstate.createBlock(8, "prevhash7", "currenhash7");

const bid4 = blockEstate.createBidTransaction(
  listing4.propertyId,
  "charlie",
  410,
  "mike"
);
const bid5 = blockEstate.createBidTransaction(
  listing4.propertyId,
  "dave",
  420,
  "mike"
);

blockEstate.addTransactionToPendingList(bid4);
blockEstate.addTransactionToPendingList(bid5);
blockEstate.createBlock(9, "prevhash8", "currenhash8");
const relist = blockEstate.createRelistTransaction(
  "alice",
  1444,
  bid1.propertyId
);
blockEstate.addTransactionToPendingList(relist);
blockEstate.createBlock(10, "10", "10");

deletelisting = blockEstate.deleteFromListing(
  listing3.seller,
  listing3.price,
  listing3.propertyId
);
blockEstate.addTransactionToPendingList(deletelisting);
blockEstate.createBlock(11, "11", "11");
console.log(blockEstate.chain);

module.exports = { blockEstate, nodeAddress };
