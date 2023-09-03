const { blockEstate } = require("../utilities/config");
const axios = require("axios");

exports.consensus = async (req, res) => {
  const currentChainLength = blockEstate.chain.length;
  let maxLength = currentChainLength;
  let longestChain = null;
  let pendingList = null;

  for (let i = 0; i < blockEstate.networkNodes.length; i++) {
    const node = blockEstate.networkNodes[i];
    console.log("Node: ", node);

    try {
      const response = await axios.get(`${node}/api/blockchain`);
      console.log("Data from axios: ", response.data);

      if (response.data.chain.length > maxLength) {
        maxLength = response.data.chain.length;
        longestChain = response.data.chain;
        pendingList = response.data.pendingList;
      }
    } catch (error) {
      console.error("Error fetching data from node:", error);
    }
  }

  if (!longestChain) {
    return res.status(200).json({
      success: true,
      message: "Current chain is the longest.",
    });
  } else if (longestChain && !blockEstate.validateChain(longestChain)) {
    return res.status(200).json({
      success: true,
      message: "Found a longer chain, but it's not valid.",
    });
  } else {
    blockEstate.chain = longestChain;
    blockEstate.pendingList = pendingList;
    return res.status(200).json({
      success: true,
      message: "Chain replaced with the longest valid chain.",
      data: blockEstate,
    });
  }
};
