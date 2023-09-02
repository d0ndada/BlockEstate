const { blockEstate } = require("../utilities/config");

exports.listProperty = (req, res) => {
  const transaction = blockEstate.createListingTransaction(
    req.body.seller,
    req.body.price
  );
  const index = blockEstate.addTransactionToPendingList(transaction);
  // fix it to work on all ***
  blockEstate.networkNodes.forEach(async (url) => {
    await axios.post(`${url}/api/property/list`, index);
  });

  res.status(200).json({ success: true, data: `Block index: ${index}` });
};

exports.createBid = (req, res) => {
  const transaction = blockEstate.createBidTransaction(
    req.body.propertyId,
    req.body.bidder,
    req.body.price,
    req.body.seller
  );
  const bid = blockEstate.addTransactionToPendingList(transaction);
  blockEstate.networkNodes.forEach(async (url) => {
    await axios.post(`${url}/api/property/bid`, bid);
  });

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
  const index = blockEstate.addTransactionToPendingList(acceptBid);
  blockEstate.networkNodes.forEach(async (url) => {
    await axios.post(`${url}/api/property/acceptBid`, index);
  });

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
    const index = blockEstate.addTransactionToPendingList(relistTransaction);
    blockEstate.networkNodes.forEach(async (url) => {
      await axios.post(`${url}/api/property/relist`, index);
    });

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
// delete an property from listing
exports.deleteListing = (req, res) => {
  const { propertyId, seller, price } = req.body;
  const status = blockEstate.findStatus(propertyId);
  const listing = status.status;

  if (listing === "For Sale" || listing === "Under Offer") {
    const deleteTransaction = blockEstate.deleteFromListing(
      seller,
      price,
      propertyId
    );
    const index = blockEstate.addTransactionToPendingList(deleteTransaction);
    blockEstate.networkNodes.forEach(async (url) => {
      await axios.post(`${url}/api/transaction`, index);
    });

    res.status(200).json({
      success: true,
      message: `Property deleted from listing successfully`,

      data: deleteTransaction,
    });
  } else {
    res.status(200).json({
      success: false,
      message: `Property cannot be deleted from listing at this moment`,
    });
  }
};
