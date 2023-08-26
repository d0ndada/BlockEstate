const { axios } = require("axios");
const { blockEstate } = require("../utilities/config");

exports.broadcastNode = async (req, res) => {
  const urlToAdd = req.body.nodeUrl;
  if (blockEstate.networkNodes.indexOf(urlToAdd) === -1) {
    blockEstate.networkNodes.push(urlToAdd);
  }
  blockEstate.networkNodes.forEach(async (url) => {
    const body = { nodeUrl: urlToAdd };
    await axios.post(`${url}/api/`, { body: body });
  });
  const body = { node: [...blockEstate.networkNodes, blockEstate.nodeUrl] };
  await axios.post(`${urlToAdd}/api/register-nodes`, {
    body: body,
  });
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
