const { blockEstate, nodeAddress } = require("../utilities/config");
const axios = require("axios");

exports.getBlockchain = (req, res) => {
  res.status(200).json({ success: true, data: blockEstate });
};

exports.approveBlock = async (req, res) => {
  const lastBlock = blockEstate.getLastBlock();
  const lastBlockHash = lastBlock.hash;
  const data = {
    data: blockEstate.pendingList,
    index: lastBlock.index + 1,
  };
  const nonce = blockEstate.proofOfWork(lastBlock, data);
  const hash = blockEstate.createHash(lastBlockHash, data, nonce);
  const newBlock = blockEstate.createBlock(nonce, lastBlockHash, hash);
  blockEstate.networkNodes.forEach(async (url) => {
    await axios.post(`${url}/api/block`, { block: newBlock });
  });
  await axios.post(`${blockEstate.nodeUrl}/api/transaction/broadcast`, {
    amount: 10,
    sender: "00",
    recipient: nodeAddress,
  });
  res.status(200).json({ success: true, data: "Aprroved new block" });
};
