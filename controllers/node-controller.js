// const axios = require("axios");
const { blockEstate } = require("../utilities/config");
const fetch = require("node-fetch");

exports.broadcastNode = async (req, res) => {
  const urlToAdd = req.body.nodeUrl;
  if (blockEstate.networkNodes.indexOf(urlToAdd) === -1) {
    blockEstate.networkNodes.push(urlToAdd);
  }
  blockEstate.networkNodes.forEach(async (url) => {
    const body = { nodeUrl: urlToAdd };
    await fetch(`${url}/api/node/register-node`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
  });
  const body = { nodes: [...blockEstate.networkNodes, blockEstate.nodeUrl] };
  await fetch(`${urlToAdd}/api/node/register-nodes`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
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
