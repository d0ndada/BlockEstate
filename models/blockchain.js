const { v4: uuidv4 } = require("uuid");
const sha256 = require("sha256");

function Blockchain() {
  this.chain = [];
  this.pendingList = [];
  this.nodeUrl = process.argv[3];
  this.networkNodes = [];

  this.createBlock(1, "Genisis", "Genisis");
}

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

Blockchain.prototype.addCommission = function (amount, sender, recipient) {
  const commission = {
    amount,
    sender,
    recipient,
  };
  return commission;
};
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

Blockchain.prototype.addTransactionToPendingList = function (transaction) {
  this.pendingList.push(transaction);
  return this.getLastBlock()["index"] + 1;
};

Blockchain.prototype.createHash = function (prevHash, data, nonce) {
  const stringToHash = prevHash + JSON.stringify(data) + nonce.toString();
  const hash = sha256(stringToHash);
  return hash;
};

Blockchain.prototype.proofOfWork = function (prevHash, data) {
  let nonce = 0;
  let hash = this.createHash(prevHash, data, nonce);

  while (hash.substring(0, 4) !== "0000") {
    nonce++;
    hash = this.createHash(prevHash, data, nonce);
  }
  return nonce;
};

Blockchain.prototype.validateChain = function (blockChain) {
  let isValid = true;
  for (i = 1; i < blockChain.length; i++) {
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

    if (previousBlock.hash !== block.previousHash) {
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

Blockchain.prototype.findStatus = function (status) {
  return this.chain.filter((block) => block.data.status === status);
};

Blockchain.prototype.findTransaction = function (transactionId) {
  const block = this.chain.find((block) =>
    block.data.find(
      (transaction) => transaction.transactionId === transactionId
    )
  );
  if (!block) {
    return null;
  } else {
    const transaction = block.data.find(
      (transaction) => transaction.transactionId === transactionId
    );
    return { transaction, block };
  }
};

Blockchain.prototype.findProperty = function (propertyId) {
  const block = this.chain.filter((block) =>
    block.data.filter(
      (property) =>
        property.propertyId === propertyId && property.type === "Bid"
    )
  );
  return { propertyId, block };
};

Blockchain.prototype.findActiveBidsOnProperty = function (propertyId) {
  const bids = [];

  this.chain.forEach((block) =>
    block.data.forEach((property) => {
      if (property.type == "Bid" && property.propertyId == propertyId) {
        bids.push(block);
      }
    })
  );
  if (bids.length === 0) {
    return null;
  }
  // else {
  //   const property = block.data.filter(
  //     (property) => property.propertyId === propertyId
  //   );
  return { bids };
};

//när man hämtar hela blocket ha med sold eller for salesom först med

module.exports = Blockchain;
