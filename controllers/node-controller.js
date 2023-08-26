const axios = require("axios");
const { blockEstate } = require("../utilities/config");

exports.broadcastNode = async (req, res) => {
  const urlToAdd = req.body.nodeUrl;
  if (blockEstate.networkNodes.indexOf(urlToAdd) === -1) {
    blockEstate.networkNodes.push(urlToAdd);
  }
  for (const url of blockEstate.networkNodes) {
    const body = { nodeUrl: urlToAdd };
    try {
      await axios.post(`${url}/api/node/register-node`, body);
    } catch (error) {
      res.status(404).json({
        success: false,
        errorMessage: "failed to add nodeUrl",
        data: body,
      });
    }
  }

  const body = { nodes: [...blockEstate.networkNodes, blockEstate.nodeUrl] };
  try {
    await axios.post(`${urlToAdd}/api/node/register-nodes`, body);
  } catch (error) {
    res.status(404).json({
      success: false,
      errorMessage: "failed to add other nodes",
      data: body,
    });
  }

  res.status(201).json({
    success: true,
    data: `Node is broadcasted ${req.body.nodeUrl}`,
  });
};
exports.addNode = (req, res) => {
  const url = req.body.nodeUrl;
  if (
    blockEstate.networkNodes.indexOf(url) === -1 &&
    blockEstate.nodeUrl !== url
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
    if (
      blockEstate.networkNodes.indexOf(url) === -1 &&
      blockEstate.nodeUrl !== url
    ) {
      blockEstate.networkNodes.push(url);
    }
  });
  res.status(201).json({
    success: true,
    data: `Nodes are added`,
  });
};
