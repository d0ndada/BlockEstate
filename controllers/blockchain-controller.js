const { blockEstate } = require("../utilities/config");

exports.getBlockchain = (req, res) => {
  res.status(200).json({ success: true, data: blockEstate });
};

exports.approveBlock = (req, res) => {
  res.status(200).json({ success: true, data: "Aprroved new block" });
};
