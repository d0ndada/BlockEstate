const { blockEstate } = require("../utilities/config");

const axios = require("axios");

exports.listProperty = (req, res) => {
  const transaction = blockEstate.createListingTransaction(
    req.body.seller,
    req.body.price
  );
  const index = blockEstate.addTransactionToPendingList(transaction);
  blockEstate.networkNodes.forEach(async (url) => {
    await axios.post(
      `${url}/api/transaction/broadcast-transaction`,
      transaction
    );
  });

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
  blockEstate.networkNodes.forEach(async (url) => {
    await axios.post(`${url}/api/transaction/broadcast-transaction`, bid);
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
  blockEstate.addTransactionToPendingList(acceptBid);
  blockEstate.networkNodes.forEach(async (url) => {
    await axios.post(`${url}/api/transaction/broadcast-transaction`, acceptBid);
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
    blockEstate.addTransactionToPendingList(relistTransaction);
    blockEstate.networkNodes.forEach(async (url) => {
      await axios.post(
        `${url}/api/transaction/broadcast-transaction`,
        relistTransaction
      );
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
    blockEstate.addTransactionToPendingList(deleteTransaction);
    blockEstate.networkNodes.forEach(async (url) => {
      await axios.post(
        `${url}/api/transaction/broadcast-transaction`,
        deleteTransaction
      );
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
