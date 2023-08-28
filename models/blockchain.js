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

Blockchain.prototype.createRelistTransaction = function (
  seller,
  price,
  propertyId
) {
  const relistTransaction = {
    type: "Relist",
    transactionId: uuidv4().split("-").join(""),
    propertyId: propertyId,
    seller,
    bidder: null,
    price,
    status: "For Sale",
    dateListed: Date.now(),
  };
  return relistTransaction;
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

Blockchain.prototype.findStatus = function (propertyId) {
  let status = "Not Found";

  this.chain.forEach((block) => {
    block.data.forEach((transaction) => {
      if (transaction.propertyId === propertyId) {
        // if (transaction.type === "AcceptBid") {
        status = transaction.status;
        // }
      }
    });
  });

  return { propertyId, status };
};

Blockchain.prototype.canRelistProperty = function (propertyId) {
  const propertyStatus = this.findStatus(propertyId).status;

  return propertyStatus === "Sold";
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
  const transactions = [];
  const sold = [];
  let findSoldBlock = false;

  this.chain.forEach((block) =>
    block.data.forEach((property) => {
      if (property.propertyId == propertyId) {
        transactions.push(block);
        findSoldBlock = true;
      }
    })
  );
  if (!findSoldBlock) {
    return { transactions };
  }
  this.chain.forEach((block) =>
    block.data.forEach((property) => {
      if (property.propertyId == propertyId) {
        if (property.status == "Sold") {
          sold.push(block);
        }
      }
    })
  );
  if (transactions.length === 0) {
    return null;
  }

  return { propertyId, sold, transactions };
};

Blockchain.prototype.findActiveBidsOnProperty = function (propertyId) {
  const underOffer = [];
  let isSold = false;

  this.chain.forEach((block) => {
    block.data.forEach((property) => {
      if (
        property.propertyId === propertyId &&
        property.type === "AcceptBid" &&
        property.status === "Sold"
      ) {
        isSold = true;
      }
    });
  });

  if (isSold) {
    return { propertyId };
  }

  this.chain.forEach((block) => {
    block.data.forEach((property) => {
      if (property.propertyId === propertyId && property.type === "Bid") {
        underOffer.push(block);
      }
    });
  });

  if (underOffer.length === 0) {
    return null;
  }

  return { propertyId, underOffer };
};

Blockchain.prototype.GetAllSoldProperty = function () {
  const sold = [];
  this.chain.forEach((block) => {
    block.data.forEach((property) => {
      if (property.status === "Sold" && property.type === "AcceptBid") {
        sold.push(block);
      }
    });
  });
  return { hasBeenSold: sold.length, sold };
};
Blockchain.prototype.GetAllListings = function () {
  const listings = [];
  const soldProperties = [];

  this.chain.forEach((block) => {
    block.data.forEach((transaction) => {
      if (transaction.status === "Sold" && transaction.type === "AcceptBid") {
        soldProperties.push(transaction.propertyId);
      }
    });
  });

  this.chain.forEach((block) => {
    block.data.forEach((property) => {
      if (
        property.status === "For Sale" &&
        property.type === "Listing" &&
        soldProperties.indexOf(property.propertyId) === -1
      ) {
        listings.push(block);
      }
    });
  });

  return { listed: listings.length, listings };
};
Blockchain.prototype.GetAllBids = function () {
  const bids = [];

  this.chain.forEach((block) => {
    block.data.forEach((property) => {
      if (property.status === "Under Offer" && property.type === "Bid") {
        bids.push(block);
      }
    });
  });
  return { bids: bids.length, block: bids };
};

Blockchain.prototype.SortDescending = function (e) {
  const descending = e.sort((a, b) => a.data.data.price - b.data.data.price);
  return descending;
};

module.exports = Blockchain;
