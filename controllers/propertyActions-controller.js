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
// list an property that has been sold working
exports.relistProperty = (req, res) => {
  const { propertyId, seller, price } = req.body;
  const canRelist = blockEstate.canRelistProperty(propertyId);
  if (canRelist) {
    const relistTransaction = blockEstate.createRelistTransaction(
      seller,
      price,
      propertyId
    );
    blockEstate.addTransactionToPendingList(relistTransaction);

    res.status(200).json({
      success: true,
      message: `Property relisted successfully`,

      data: relistTransaction,
    });
  } else {
    res.status(200).json({
      success: false,
      message: `Property cannot be relisted at this moment`,
    });
  }
};
