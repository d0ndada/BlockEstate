const axios = require("axios");
const { blockEstate, nodeAddress } = require("../utilities/config");

exports.getBlockchain = (req, res) => {
  res.status(200).json(blockEstate);
};

exports.mineBlock = async (req, res) => {
  const previousBlock = blockEstate.getLastBlock();
  const previousHash = previousBlock.hash;
  const data = {
    data: blockEstate.pendingList,
    index: previousBlock.index + 1,
  };
  const nonce = blockEstate.proofOfWork(previousHash, data);
  const hash = blockEstate.createHash(previousHash, data, nonce);

  // blockEstate.addTransaction(6.25, '00', nodeAddress);

  const block = blockEstate.createBlock(nonce, previousHash, hash);

  blockEstate.networkNodes.forEach(async (url) => {
    await axios.post(`${url}/api/block`, { block: block });
  });

  await axios.post(`${blockEstate.nodeUrl}/api/transaction/broadcast`, {
    amount: 6.25,
    sender: "00",
    recipient: nodeAddress,
  });

  res.status(200).json({
    success: true,
    data: block,
  });
};
