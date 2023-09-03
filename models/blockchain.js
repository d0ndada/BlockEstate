const { v4: uuidv4 } = require("uuid");
const sha256 = require("sha256");

function Blockchain() {
  this.chain = [];
  this.pendingList = [];
  this.nodeUrl = process.argv[3];
  this.networkNodes = [];

  this.createBlock(1, "Genisis", "Genisis");
}
// Create Blck in the blockchain
Blockchain.prototype.createBlock = function (nonce, previousHash, hash) {
  const block = {
    index: this.chain.length + 1,
    timestamp: Date.now(),
    data: this.pendingList,
    nonce: nonce,
    hash: hash,
    previousHash,
  };
  this.pendingList = [];
  this.chain.push(block);

  return block;
};

Blockchain.prototype.getLastBlock = function () {
  return this.chain.at(-1);
};

// creating transaction Listing // Added potentially propertyDetails not in action yet

Blockchain.prototype.createListingTransaction = function (
  seller,
  price
  //   propertyDetails
) {
  const transaction = {
    type: "Listing",
    transactionId: uuidv4().split("-").join(""),
    propertyId: uuidv4().split("-").join(""),
    seller,
    buyer: null,
    price,
    status: "For Sale",
    dateListed: Date.now(),
    // propertyDetails: {
    //   address: propertyDetails.address,
    //   size: propertyDetails.size,
    //   bedrooms: propertyDetails.bedrooms,
    //   bathrooms: propertyDetails.bathrooms,
    //   description: propertyDetails.description,
    // },
  };
  return transaction;
};
// for pof reward fo the agents(realitor) get reward for blocks approve or transaction approved to be right
Blockchain.prototype.addCommission = function (amount, sender, recipient) {
  const commission = {
    amount,
    sender,
    recipient,
  };
  return commission;
};

// creating transaction CreateBid

Blockchain.prototype.createBidTransaction = function (
  propertyId,
  bidder,
  price,
  seller
) {
  const transaction = {
    type: "Bid",
    transactionId: uuidv4().split("-").join(""),
    propertyId,
    seller,
    bidder,
    price,
    status: "Under Offer",
    dateBid: Date.now(),
  };
  return transaction;
};

// creating transaction Accept bid on property

Blockchain.prototype.acceptBidTransaction = function (
  transactionId,
  propertyId,
  bidder,
  price,
  seller
) {
  const transaction = {
    type: "AcceptBid",
    transactionId: uuidv4().split("-").join(""),
    bidTransactionId: transactionId,
    propertyId,
    seller,
    bidder,
    price,
    status: "Sold",
    dateSold: Date.now(),
  };
  return transaction;
};
// creating transaction Delete Listing

Blockchain.prototype.deleteFromListing = function (seller, price, propertyId) {
  const deleteTransaction = {
    type: "DELETE",
    transactionId: uuidv4().split("-").join(""),
    propertyId: propertyId,
    seller,
    bidder: null,
    price,
    status: "DELETED",
    dateListed: Date.now(),
  };
  return deleteTransaction;
};
// creating transaction Relist
Blockchain.prototype.createRelistTransaction = function (
  seller,
  price,
  propertyId
) {
  const relistTransaction = {
    type: "Listing",
    transactionId: uuidv4().split("-").join(""),
    propertyId,
    seller,
    bidder: null,
    price,
    status: "For Sale",
    dateListed: Date.now(),
  };
  return relistTransaction;
};
// adding to pending list a transaction
Blockchain.prototype.addTransactionToPendingList = function (transaction) {
  this.pendingList.push(transaction);
  return this.getLastBlock()["index"] + 1;
};
// creating the hash
Blockchain.prototype.createHash = function (prevHash, data, nonce) {
  const stringToHash = prevHash + JSON.stringify(data) + nonce.toString();
  const hash = sha256(stringToHash);
  return hash;
};
// pof for mining
Blockchain.prototype.proofOfWork = function (prevHash, data) {
  let nonce = 0;
  let hash = this.createHash(prevHash, data, nonce);

  while (hash.substring(0, 4) !== "0000") {
    nonce++;
    hash = this.createHash(prevHash, data, nonce);
  }
  return nonce;
};

// validateChain
Blockchain.prototype.validateChain = function (blockChain) {
  let isValid = true;
  for (let i = 1; i < blockChain.length; i++) {
    const block = blockChain[i];
    const previousBlock = blockChain[i - 1];
    const hash = this.createHash(
      previousBlock,
      { data: block.data, index: block.index },
      block.nonce
    );

    if (hash !== block.hash) {
      isValid = false;
    }

    if (block.previousHash !== previousBlock.hash) {
      isValid = false;
    }
  }

  const genesisBlock = blockChain.at(0);
  const isGenesisNonceValid = genesisBlock.nonce === 1;
  const isGenesisHashValid = genesisBlock.hash === "Genisis";
  const isGenesisPreviousHashValid = genesisBlock.previousHash === "Genisis";
  const hasNoData = genesisBlock.data.length === 0;
  if (
    !isGenesisNonceValid ||
    !isGenesisHashValid ||
    !isGenesisPreviousHashValid ||
    !hasNoData
  ) {
    isValid = false;
  }
  return isValid;
};

// FInd the status on property show status, amount(asold, listed, bids,) deleted to show fasle or true
Blockchain.prototype.findStatus = function (propertyId) {
  let status = "Not Found";
  let sold = 0;
  let listed = 0;
  let bids = 0;
  let deleted = 0;
  let count = 0;
  let isListed = false;

  for (let i = 0; i < this.chain.length; i++) {
    const block = this.chain[i];
    for (let j = 0; j < block.data.length; j++) {
      const property = block.data[j];
      if (property.propertyId === propertyId) {
        status = property.status;

        if (property.type === "AcceptBid") {
          sold++;
          isListed = false;
        }
        if (property.type === "Listing") {
          listed++;

          isListed = true;
        }
        if (property.type === "Bid") {
          bids++;
          isListed = true;
        }
        if (property.type == "DELETE") {
          isListed = false;
          deleted++;
        }
        count = bids + sold + listed + deleted;
      }
    }
  }

  return {
    propertyId,
    status,
    transactions: count,
    sold,
    listed,
    bids,
    isListed,
  };
};
// Checking if a property can be relisted by looking if it is currently sold
Blockchain.prototype.canRelistProperty = function (propertyId) {
  const propertyStatus = this.findStatus(propertyId).status;

  return propertyStatus === "Sold" || propertyStatus === "DELETED";
};

// Finding transaction by transactionId as input
Blockchain.prototype.findTransaction = function (transactionId) {
  const foundTransaction = [];
  const foundBlock = [];

  for (let i = 0; i < this.chain.length; i++) {
    const block = this.chain[i];
    for (let j = 0; j < block.data.length; j++) {
      const transaction = block.data[j];
      if (transaction.transactionId === transactionId) {
        foundTransaction.push(transaction);
        foundBlock.push(block);
      }
    }
  }
  if (!foundTransaction.length > 0) {
    return null;
  } else {
    return { transaction: foundTransaction, block: foundBlock };
  }
};

// Finding property by its ID
Blockchain.prototype.findProperty = function (propertyId) {
  const transactions = [];
  const status = [];
  const findStatus = this.findStatus(propertyId);
  status.push(findStatus);

  for (let i = 0; i < this.chain.length; i++) {
    const block = this.chain[i];
    const relevant = [];

    for (let j = 0; j < block.data.length; j++) {
      const property = block.data[j];
      if (property.propertyId === propertyId) {
        relevant.push(property);
      }
    }
    if (relevant.length > 0) {
      const cloneBlock = { ...block, data: relevant };
      transactions.push(cloneBlock);
    }
  }

  if (transactions.length === 0) {
    return null;
  }

  return {
    property: status,
    transactions,
  };
};

// Finding active bids on property, only if it is ongoing listing not SOLD or DELETED

Blockchain.prototype.findActiveBidsOnProperty = function (propertyId) {
  const underOffer = [];
  let isSold = false;

  for (let i = 0; i < this.chain.length; i++) {
    const block = this.chain[i];
    for (let j = 0; j < block.data.length; j++) {
      const property = block.data[j];
      if (
        property.propertyId === propertyId &&
        property.type === "AcceptBid" &&
        property.status === "Sold"
      ) {
        isSold = true;
      }
      if (property.propertyId === propertyId && property.type === "Bid") {
        underOffer.push(block);
      }
    }
  }
  if (isSold) {
    return { propertyId };
  }

  if (underOffer.length === 0) {
    return null;
  }

  return { propertyId, underOffer };
};

//  Fetching all sold property on the chain
// need to check against the new DELETED property addition *******
Blockchain.prototype.GetAllSoldProperty = function () {
  const sold = [];

  for (let i = 0; i < this.chain.length; i++) {
    const block = this.chain[i];
    for (let j = 0; j < block.data.length; j++) {
      const property = block.data[j];
      if (property.status === "Sold" && property.type === "AcceptBid") {
        sold.push(block);
      }
    }
  }

  return { hasBeenSold: sold.length, sold };
};

// Fethcing all the listing made on the chain
Blockchain.prototype.GetAllListings = function () {
  const listings = [];

  for (let i = 0; i < this.chain.length; i++) {
    const block = this.chain[i];
    for (let j = 0; j < block.data.length; j++) {
      const property = block.data[j];
      if (property.status === "For Sale" && property.type === "Listing") {
        listings.push(block);
      }
    }
  }

  return { listed: listings.length, listings };
};

// Fethcing all the active listing made on the chain, meaning not SOLD or DELETED

// TODO: not showing an DELETED property that got relisted**********
Blockchain.prototype.GetActiveListings = function () {
  const listings = [];
  const propertyStatus = {};

  // Process the chain in reverse order to get the most recent status of each property
  this.chain
    .slice()
    .reverse()
    .forEach((block) => {
      block.data.forEach((transaction) => {
        // If the property is already processed, skip it
        if (propertyStatus[transaction.propertyId]) return;

        if (transaction.status === "Sold" && transaction.type === "AcceptBid") {
          propertyStatus[transaction.propertyId] = "Sold";
        } else if (
          transaction.status === "DELETED" &&
          transaction.type === "DELETE"
        ) {
          propertyStatus[transaction.propertyId] = "DELETED";
        } else if (
          transaction.status === "For Sale" &&
          transaction.type === "Listing"
        ) {
          propertyStatus[transaction.propertyId] = "For Sale";
          listings.push(block);
        }
      });
    });

  return { listed: listings.length, listings };
};

// Fetching all the bids made on the chain

Blockchain.prototype.GetAllBids = function () {
  const bids = [];

  for (let i = 0; i < this.chain.length; i++) {
    const block = this.chain[i];
    for (let j = 0; j < block.data.length; j++) {
      const property = block.data[j];
      if (property.status === "Under Offer" && property.type === "Bid") {
        bids.push(block);
      }
    }
  }

  return { bids: bids.length, block: bids };
};

// not test to work not using it
Blockchain.prototype.SortDescending = function (e) {
  const descending = e.sort((a, b) => a.data.data.price - b.data.data.price);
  return descending;
};

module.exports = Blockchain;
