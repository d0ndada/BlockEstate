const fetch = require("node-fetch");

exports.broadcastNode = async (req, res) => {
  // 1. Placera nya noden i aktuell nodes networkNodes lista...
  const urlToAdd = req.body.nodeUrl;

  if (blockEstate.networkNodes.indexOf(urlToAdd) === -1) {
    blockEstate.networkNodes.push(urlToAdd);
  }
  // 2. Iterera igenom vår networkNodes lista och skicka till varje node
  // i listan samma nya node
  blockEstate.networkNodes.forEach(async (url) => {
    const body = { nodeUrl: urlToAdd };

    await fetch(`${url}/api/node/register-node`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
  });
  // 3. Uppdatera nya noden med samma noder som vi har i nätverket...
  const body = { nodes: [...blockEstate.networkNodes, blockEstate.nodeUrl] };

  await fetch(`${urlToAdd}/api/node/register-nodes`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });

  res.status(201).json({ success: true, data: "nodes regristeresd" });
};

// Registrera enskild node
exports.addNode = (req, res) => {
  // Få in en nodes unika adress(URL)...
  const url = req.body.nodeUrl; //http://localhost:3001
  // Kontrollera att vi inte redan har registrerat denna URL...
  // Om inte registrera, dvs placera noden i vår networkNode lista...
  if (
    blockEstate.networkNodes.indexOf(url) === -1 &&
    blockEstate.nodeUrl !== url
  ) {
    blockEstate.networkNodes.push(url);
  }

  res.status(201).json({ success: true, data: "New node added" });
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
  res.status(201).json({ success: true, data: "New nodes added" });
};
