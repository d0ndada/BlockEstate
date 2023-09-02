const express = require("express");
const { blockEstate, nodeAddress } = require("./utilities/config");
const fetch = require("node-fetch");
const axios = require("axios");
const blockchain = require("./routes/blockchain-routes");
// const block = require("./routes/block-routes");
// const transaction = require("./routes/transaction-routes");
// const node = require("./routes/node-routes");
const consensus = require("./routes/consensus-routes");

const app = express();

const PORT = process.argv[2];

app.use(express.json());

app.use("/api/blockchain", blockchain);

app.use("/api/consensus", consensus);

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

app.post("/api/transaction/:id/list", (req, res) => {
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
app.get("/api/property/bids/active/:id", (req, res) => {
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

  if (!result) {
    return res.status(404).json({
      status: 404,
      success: false,
      message: `Not a property by ${req.params.id}`,
    });
  }
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
//NOTE: shows all property if it has been sold can show same property id on SOLD and then on LIVE LISTING
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
// working
app.use("/api/property/listed/record", (req, res) => {
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
// working
app.use("/api/property/listed/live", (req, res) => {
  const result = blockEstate.GetActiveListings();
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
// nworking
app.get("/api/property/biddings", (req, res) => {
  const result = blockEstate.GetAllBids();
  if (!result) {
    return res.status(404).json({
      status: 404,
      success: false,
      message: `No bids found`,
    });
  }
  res.status(200).json({
    success: true,
    data: result,
  });
});

// list an property that has been sold working
app.post("/api/property/relist", (req, res) => {
  const { propertyId, seller, price } = req.body;
  const canRelist = blockEstate.canRelistProperty(propertyId);
  if (canRelist) {
    const relistTransaction = blockEstate.createRelistTransaction(
      seller,
      price,
      propertyId
    );
    blockEstate.addTransactionToPendingList(relistTransaction);

    res.status(200).json({
      success: true,
      message: `Property relisted successfully`,

      data: relistTransaction,
    });
  } else {
    res.status(200).json({
      success: false,
      message: `Property cannot be relisted at this moment`,
    });
  }
});

// maybe date: listed, bids, sold or more

// maybe add apartment details soon.

// app.use("/api/blockEstate", blockchain);
// app.use("/api/block", block);
// app.use("/api/transaction", transaction);
// app.use("/api/node", node);
// app.use("/api/consensus", consensus);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
// house get relisted fix that so it can be listed again
