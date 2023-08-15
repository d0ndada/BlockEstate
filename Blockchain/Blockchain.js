const Block = require("./Block");
// const Block = require("./Block");
const crypto = require("../utilities/hash");
const TransactionPool = require("../Wallet/TransactionPool");
const Transaction = require("../Wallet/Transaction");

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
    this.transactionPool = new TransactionPool();
  }

  addBlock({ transactions }) {
    const addedBlock = Block.mineBlock({
      lastBlock: this.chain.at(-1),
      data: transactions,
    });
    this.chain.push(addedBlock);
    return addedBlock;
  }

  replaceChain(chain) {
    if (chain.length <= this.chain.length) return;

    if (!Blockchain.isValid(chain)) return;

    this.chain = chain;
  }

  static isValid(chain) {
    if (JSON.stringify(chain.at(0)) !== JSON.stringify(Block.genesis())) {
      return false;
    }

    for (let i = 1; i < chain.length; i++) {
      const { timestamp, transactions, hash, lastHash, nonce, difficulty } =
        chain.at(i);
      const prevHash = chain[i - 1].hash;

      if (lastHash !== prevHash) return false;

      const validHash = crypto(
        timestamp,
        transactions,
        lastHash,
        nonce,
        difficulty
      );
      if (hash !== validHash) return false;

      for (let transaction of transactions) {
        if (!Transaction.validateTransaction(transaction)) {
          return false;
        }
      }
    }

    return true;
  }
}

module.exports = Blockchain;
