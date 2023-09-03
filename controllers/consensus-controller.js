const { blockEstate } = require("../utilities/config");
const axios = require("axios");

exports.consensus = async (req, res) => {
  const currentChainLength = blockEstate.chain.length;
  let maxLength = currentChainLength;
  let longestChain = null;
  let pendingList = null;

  blockEstate.networkNodes.forEach((node) => {
    console.log("Node: ", node);

    axios(`${node}/api/blockchain`).then((data) => {
      console.log("Data ifrån axios: ", data);

      if (data.data.chain.length > maxLength) {
        maxLength = data.data.chain.length;
        longestChain = data.data.chain;
        pendingList = data.data.pendingList;
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
};
