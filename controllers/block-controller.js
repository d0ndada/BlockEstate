exports.addBlock = (req, res) => {
  res.status(200).json({ success: true, data: "added block" });
};

exports.getLastBlock = (req, res) => {
  res.status(200).json({ success: true, data: "last block" });
};
