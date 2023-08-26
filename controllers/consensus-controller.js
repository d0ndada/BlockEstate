const axios = require("axios");
const { blockEstate } = require("../utilities/config");

exports.synchronize = (req, res) => {
  const currentChainLength = blockEstate.chain.length;
  const maxLength = currentChainLength;
  let longestChain = null;
  let pendingList = null;

  blockEstate.networkNodes.forEach((node) => {
    axios(`http://localhost:${node}/api/blockEstate`).then((data) => {
      if (currentChainLength < data.data.data.chain.length) {
        longestChain = data.data.data.chain;
        pendingList = data.data.data.pendingList;
        maxLength = data.data.data.length;
      }
      if (
        !longestChain ||
        (longestChain && !blockEstate.validateChain(longestChain))
      ) {
        console.log("No replacement needed");
      } else {
        blockEstate.chain = longestChain;
        blockEstate.pendingList = pendingList;
        res.status(200).json({ success: true, data: blockEstate });
      }
    });
  });

  res.status(200).json({ success: true, data: "Nodes are synchronized" });
};
