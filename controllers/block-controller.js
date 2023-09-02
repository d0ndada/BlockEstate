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
      errorMessage: "Blocket är inte godkänt",
      data: block,
    });
  }
};
