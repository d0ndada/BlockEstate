const axios = require("axios");
const { blockEstate, nodeAddress } = require("../utilities/config");

exports.getBlockchain = (req, res) => {
  res.status(200).json(blockEstate);
};

exports.mineBlock = async (req, res) => {
  const lastBlock = blockEstate.getLastBlock();

  const lastBlockHash = lastBlock.hash;

  const data = {
    data: blockEstate.pendingList,
    index: lastBlock.index + 1,
  };

  const nonce = blockEstate.proofOfWork(lastBlockHash, data);

  const hash = blockEstate.createHash(lastBlockHash, data, nonce);

  const newBlock = blockEstate.createBlock(nonce, lastBlockHash, hash);

  blockEstate.networkNodes.forEach(async (url) => {
    await axios.post(`${url}/api/block`, { block: newBlock });
  });

  await axios.post(`${blockEstate.nodeUrl}/api/transaction/broadcast`, {
    commission: 6.25,
    sender: "SYSTEM",
    recipient: nodeAddress,
  });
  res.status(200).json({ success: true, data: newBlock });
};
