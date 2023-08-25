const { blockEstate } = require("../utilities/config");

exports.addBlock = (req, res) => {
  const block = req.body.block;
  const lastBlock = blockEstate.getLastBlock();
  const hashIsCorrect = lastBlock.hash === block.previousHash;
  const hasCorrectIndex = lastBlock.index + 1 === block.index;
  if (hasCorrectIndex && hashIsCorrect) {
    blockEstate.chain.push(block);
    blockEstate.pendingList = [];
    res.status(200).json({ success: true, data: block });
  } else {
    res
      .status(400)
      .json({
        success: false,
        errorMessage: "Block is not valid",
        data: block,
      });
  }
};

exports.getLastBlock = (req, res) => {
  res.status(200).json({ success: true, data: "last block" });
};
