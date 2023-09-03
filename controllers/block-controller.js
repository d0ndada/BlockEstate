const { blockEstate } = require("../utilities/config");

exports.block = (req, res) => {
  const block = req.body.block;
  const lastBlock = blockEstate.getLastBlock();
  const hashIsCorrect = lastBlock.hash === block.previousHash;
  const hasCorrectIndex = lastBlock.index + 1 === block.index;

  if (hashIsCorrect && hasCorrectIndex) {
    blockEstate.chain.push(block);
    blockEstate.pendingList = [];
    res.status(201).json({ success: true, data: block });
  } else {
    res.status(400).json({
      success: false,
      errorMessage: "Block not approved",
      data: block,
    });
  }
};

exports.findBlock = (req, res) => {
  const block = req.params.hash;
  const result = blockEstate.findBlock(block);
  if (!result) {
    return res.status(404).json({
      success: false,
      errorMessage: "Block not found",
      data: block,
    });
  }
  res.status(201).json({ success: true, data: result });
};
