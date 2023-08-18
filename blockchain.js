function Blockchain() {
  this.chain = [];
  this.pendingList = [];
}

Blockchain.prototype.createBlock = function (nonce, previousHash, hash) {
  const bock = {
    index: this.chain.length + 1,
    timestamp: Date.now(),
    data: this.pendingList,
    nonce: nonce,
    hash: hash,
    previousHash,
  };
};
