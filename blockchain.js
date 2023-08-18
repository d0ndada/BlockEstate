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
  price,
  propertyDetails
) {
  const transaction = {
    transactionId: uuidv4().split("-").join(""),
    propertyId: uuidv4().split("-").join(""),
    seller,
    buyer: null,
    price,
    status: "For Sale",
    dateListed: Date.now(),
    propertyDetails: {
      address: propertyDetails.address,
      size: propertyDetails.size,
      bedrooms: propertyDetails.bedrooms,
      bathrooms: propertyDetails.bathrooms,
      description: propertyDetails.description,
    },
  };
  return transaction;
};
