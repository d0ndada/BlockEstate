exports.listProperty = (req, res) => {
  const transaction = blockEstate.createListingTransaction(
    req.body.seller,
    req.body.price
  );
  const index = blockEstate.addTransactionToPendingList(transaction);
  res.status(200).json({ success: true, data: `Block index: ${index}` });
};

exports.createBid = (req, res) => {
  const bid = blockEstate.createBidTransaction(
    req.body.propertyId,
    req.body.bidder,
    req.body.price,
    req.body.seller
  );
  blockEstate.addTransactionToPendingList(bid);
  res.status(200).json({ success: true, data: "created bid of house" });
};

exports.acceptBid = (req, res) => {
  const acceptBid = blockEstate.acceptBidTransaction(
    req.body.transactionId,
    req.body.propertyId,
    req.body.bidder,
    req.body.price,
    req.body.seller
  );
  blockEstate.addTransactionToPendingList(acceptBid);
  res.status(200).json({ success: true, data: "accepted bid of house" });
};
