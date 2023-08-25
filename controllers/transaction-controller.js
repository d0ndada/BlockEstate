exports.createListing = (req, res) => {
  res.status(200).json({ success: true, data: "created listing of house" });
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
