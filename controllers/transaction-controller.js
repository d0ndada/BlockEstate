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
  const commission = blockEstate.addCommission(
    req.body.amount,
    req.body.sender,
    req.body.recipient
  );
  blockEstate.addTransactionToPendingList(commission);

  blockEstate.networkNodes.forEach(async (url) => {
    await axios.post(`${url}/api/transaction`, commission);
  });
  res.status(200).json({ success: true, data: "Transaction broadcasted" });
};
