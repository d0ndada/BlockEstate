const { blockEstate } = require("../utilities/config");

exports.createListing = (req, res) => {
  const transaction = blockEstate.createListingTransaction(
    req.body.seller,
    req.body.price
  );
  const index = blockEstate.addTransactionToPendingList(transaction);
  res.status(200).json({ success: true, data: `Block index: ${index}` });
};

exports.createBid = (req, res) => {
  res.status(200).json({ success: true, data: "created bid of house" });
};

exports.acceptBidTransaction = (req, res) => {
  res.status(200).json({ success: true, data: "accepted bid of house" });
};

exports.broadcastTransactions = (req, res) => {
  res.status(200).json({ success: true, data: "Transaction broadcasted" });
};
