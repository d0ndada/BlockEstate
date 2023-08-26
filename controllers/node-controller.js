const { blockEstate } = require("../utilities/config");

exports.broadcastNode = (req, res) => {
  res.status(201).json({
    success: true,
    data: `Node is broadcasted ${req.body.nodeUrl}`,
  });
};
exports.addNode = (req, res) => {
  const url = req.body.nodeUrl;
  if (
    (blockEstate.networkNodes,
    indexOf(url) === -1 && blockEstate.nodeUrl !== url)
  ) {
    blockEstate.networkNodes.push(url);
  }
  res.status(201).json({
    success: true,
    data: `Node ${url} is added`,
  });
};
exports.addNodes = (req, res) => {
  const allNodes = req.body.nodes;

  allNodes.forEach((url) => {
    if (blockEstate.indexOf(url) === -1 && blockEstate.nodeUrl !== url) {
      blockEstate.networkNodes.push(url);
    }
  });
  res.status(201).json({
    success: true,
    data: `Nodes are added`,
  });
};
