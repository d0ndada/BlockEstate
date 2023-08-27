const express = require("express");
const { blockEstate, nodeAddress } = require("./utilities/config");
const fetch = require("node-fetch");
const axios = require("axios");
// const blockchain = require("./routes/blockchain-routes");
// const block = require("./routes/block-routes");
// const transaction = require("./routes/transaction-routes");
// const node = require("./routes/node-routes");
// const consensus = require("./routes/consensus-route");

const app = express();

const PORT = process.argv[2];

app.use(express.json());

app.get("/api/blockchain", (req, res) => {
  res.status(200).json(blockEstate);
});

app.post("/api/transaction/broadcast", (req, res) => {
  const transaction = blockEstate.addCommission(
    req.body.amount,
    req.body.sender,
    req.body.recipient
  );
  blockEstate.addTransactionToPendingList(transaction);
  // iterara igenom all nätverksnoder i network nodes och anropa respektiva node
  blockEstate.networkNodes.forEach(async (url) => {
    await axios.post(`${url}/api/transaction`, transaction);
  });
  // och skicka över den nya transaktionn..

  // behöver vi använda axios för att göra ett post anrop
  // await axios.post(url.body)

  res
    .status(201)
    .json({ success: true, data: `Commisone created and updated` });
});

app.post("/api/transaction/list", (req, res) => {
  const transaction = blockEstate.createListingTransaction(
    req.body.seller,
    req.body.price
  );
  const index = blockEstate.addTransactionToPendingList(transaction);
  res.status(200).json({ success: true, data: `Block index: ${index}` });
});

app.post("/api/transaction/bid", (req, res) => {
  const bid = blockEstate.createBidTransaction(
    req.body.propertyId,
    req.body.bidder,
    req.body.price,
    req.body.seller
  );
  blockEstate.addTransactionToPendingList(bid);
  res.status(200).json({ success: true, data: "created bid of house" });
});

app.post("api/transaction/accept", (req, res) => {
  const acceptBid = blockEstate.acceptBidTransaction(
    req.body.transactionId,
    req.body.propertyId,
    req.body.bidder,
    req.body.price,
    req.body.seller
  );
  blockEstate.addTransactionToPendingList(acceptBid);
  res.status(200).json({ success: true, data: "accepted bid of house" });
});

app.get("/api/approve", async (req, res) => {
  // 1. hömta senaste blocket
  const lastBlock = blockEstate.getLastBlock();
  //   console.log("lastblock: ", lastblock);
  // 2få tag i det senaste hashed
  const lastBlockHash = lastBlock.hash;
  //   console.log("lastblockHash: ", lastBlockHash);

  // 3 skapa ett data objekt som innehåller
  //  3.1 data egenskap som ska innehålla allt i  utestående list
  // 3.2 idnex egenska som ger rätt index till nya blocket...
  const data = {
    data: blockEstate.pendingList,
    index: lastBlock.index + 1,
  };
  //  4. skapa ett (nocne) värder
  const nonce = blockEstate.proofOfWork(lastBlockHash, data);
  //5.  skapa,räkna fram en hash för vårt nya block
  const hash = blockEstate.createHash(lastBlockHash, data, nonce);
  // 6. create Block....
  //   blockEstate.addTransaction(6.25, "00", nodeAddress);
  const newBlock = blockEstate.createBlock(nonce, lastBlockHash, hash);
  // 7. Retunera blocket till avsänderan

  blockEstate.networkNodes.forEach(async (url) => {
    //   Anropa en endpoint /api/block som tar som argument body vårt nya block
    await axios.post(`${url}/api/block`, { block: newBlock });
  });

  await axios.post(`${blockEstate.nodeUrl}/api/transaction/broadcast`, {
    amount: 6.25,
    sender: "00",
    recipient: nodeAddress,
  });

  res.status(200).json({ success: true, data: newBlock });
});

app.post("/api/block", (req, res) => {
  const block = req.body.block;
  const lastBlock = blockEstate.getLastBlock();
  const hashIsCorrect = lastBlock.hash === block.previousHash;
  const hasCorrectIndex = lastBlock.index + 1 === block.index;

  if (hashIsCorrect && hasCorrectIndex) {
    blockEstate.chain.push(block);
    blockEstate.pendingList = [];
    res.status(201).json({ success: true, data: block });
  } else {
    res.status(400).json({
      success: false,
      errorMessage: "Blocket är inte godkänt",
      data: block,
    });
  }
});

/* ----------------------------------------------------------------------------------------- */
/* Administrativa endpoints... */
/* ----------------------------------------------------------------------------------------- */

// Registrera och skicka ut nya noder till alla noder i det befintliga nätverket...

app.post("/api/register-broadcast-node", async (req, res) => {
  // 1. Placera nya noden i aktuell nodes networkNodes lista...
  const urlToAdd = req.body.nodeUrl;

  if (blockEstate.networkNodes.indexOf(urlToAdd) === -1) {
    blockEstate.networkNodes.push(urlToAdd);
  }
  // 2. Iterera igenom vår networkNodes lista och skicka till varje node
  // i listan samma nya node
  blockEstate.networkNodes.forEach(async (url) => {
    const body = { nodeUrl: urlToAdd };

    await fetch(`${url}/api/register-node`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
  });
  // 3. Uppdatera nya noden med samma noder som vi har i nätverket...
  const body = { nodes: [...blockEstate.networkNodes, blockEstate.nodeUrl] };

  await fetch(`${urlToAdd}/api/register-nodes`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });

  res.status(201).json({ success: true, data: "nodes regristeresd" });
});

// Registrera enskild node
app.post("/api/register-node", (req, res) => {
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
});

app.post("/api/register-nodes", (req, res) => {
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
});

// conecnsues endpoint

app.get("/api/consensus", (req, res) => {
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
        return res
          .status(200)
          .json({
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
});

// working
app.get("/api/transaction/:id", (req, res) => {
  const result = blockEstate.findTransaction(req.params.id);
  if (!result) {
    return res.status(404).json({
      status: 404,
      success: false,
      message: `Did not find a transaction by id ${req.params.id}`,
    });
  }
  res.status(200).json({ success: true, data: result });
});
// working
app.get("/api/property/status/:id", (req, res) => {
  const result = blockEstate.findStatus(req.params.id);
  if (!result) {
    return res.status(404).json({
      status: 404,
      success: false,
      message: `Did not find property with id ${req.params.id}`,
    });
  }
  console.log(result);
  res
    .status(200)
    .json({ success: true, property: req.params.id, data: result });
});
//working
app.get("/api/property/bids/:id", (req, res) => {
  const result = blockEstate.findActiveBidsOnProperty(req.params.id);
  if (!result) {
    return res.status(404).json({
      status: 404,
      success: false,
      message: `Not a property by ${req.params.id}`,
    });
  } else if (!result.underOffer) {
    return res.status(404).json({
      status: 404,
      success: false,
      message: `Property with id-${req.params.id} has been sold or not any bids yet`,
    });
  }
  res.status(200).json({
    success: true,
    data: result,
  });
});

//working
app.get("/api/property/transactions/:id", (req, res) => {
  const result = blockEstate.findProperty(req.params.id);
  if (!result.propertyId) {
    return res.status(404).json({
      status: 404,
      success: false,
      message: `Not a property by ${req.params.id}`,
    });
  }
  if (!result.transactions) {
    return res.status(404).json({
      status: 404,
      success: false,
      message: `Not a property by ${req.params.id}`,
    });
  }
  res.status(200).json({
    success: true,
    data: result,
  });
});

// working
app.use("/api/property/sold", (req, res) => {
  const result = blockEstate.GetAllSoldProperty();
  if (!result.sold) {
    return res.status(404).json({
      status: 404,
      success: false,
      message: `No property has been sold`,
    });
  }
  res.status(200).json({
    success: true,
    data: result,
  });
});
// get listings
app.use("/api/property/listed", (req, res) => {
  const result = blockEstate.GetAllListings();
  if (!result.listings) {
    return res.status(404).json({
      status: 404,
      success: false,
      message: `No property has been listed`,
    });
  }
  res.status(200).json({
    success: true,
    data: result,
  });
});

// app.use("/api/blockEstate", blockchain);
// app.use("/api/block", block);
// app.use("/api/transaction", transaction);
// app.use("/api/node", node);
// app.use("/api/consensus", consensus);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
// find info about transactions with id
// find bids on property
// find properies for Sale
// find properties sold
// find active bids for all propertiesn
