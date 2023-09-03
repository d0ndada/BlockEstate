const { blockEstate } = require("../utilities/config");
const axios = require("axios");

exports.broadcast = (req, res) => {
  const transaction = blockEstate.addCommission(
    req.body.amount,
    req.body.sender,
    req.body.recipient
  );
  blockEstate.addTransactionToPendingList(transaction);
  blockEstate.networkNodes.forEach(async (url) => {
    await axios.post(`${url}/api/transaction`, transaction);
  });

  res
    .status(201)
    .json({ success: true, data: `Commisson created and updated` });
};

exports.transaction = (req, res) => {
  const transaction = req.body;
  const index = blockEstate.addTransactionToPendingList(transaction);
  res.status(201).json({ success: true, data: `Block index: ${index}` });
};

exports.getTransaction = (req, res) => {
  const result = blockEstate.findTransaction(req.params.id);
  if (!result) {
    return res.status(404).json({
      status: 404,
      success: false,
      message: `Did not find a transaction by id ${req.params.id}`,
    });
  }
  res.status(200).json({ success: true, data: result });
};
