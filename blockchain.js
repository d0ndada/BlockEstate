const { v4: uuidv4 } = require("uuid");

function Blockchain() {
  this.chain = [];
  this.pendingList = [];
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
    type: "listing",
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

Blockchain.prototype.createPurchaseTransaction = function (
  propertyId,
  buyer,
  price,
  seller
) {
  const transaction = {
    type: "purchase",
    transactionId: uuidv4().split("-").join(""),
    propertyId,
    seller,
    buyer,
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

  while (hash.substring(0, 4) != "0000") {
    nonce++;
    hahs = this.createHash(prevHash, data, nonce);
  }
  return nonce;
};

module.exports = Blockchain;
