// conecnsues endpoint

exports.consensus = (req, res) => {
  const currentChainLength = blockEstate.chain.length;
  let maxLength = currentChainLength;
  let longestChain = null;
  let pendingList = null;

  // Iterera igenom alla noder i nätverket som finns upplagda på aktuell node...
  blockEstate.networkNodes.forEach((node) => {
    console.log("Node: ", node);

    axios(`${node}/api/blockchain`).then((data) => {
      console.log("Data ifrån axios: ", data);

      if (data.data.chain.length > maxLength) {
        maxLength = data.data.chain.length;
        longestChain = data.data.chain;
        pendingList = data.data.pendingList;
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
        res.status(200).json({
          success: true,
          message: "Chain replaced with the longest valid chain.",
          data: blockEstate,
        });
      }
    });
  });
};
