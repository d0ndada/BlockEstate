const hexToBinary = require("hex-to-binary");
const crypto = require("../utilities/hash");
const { GENESIS_DATA, MINE_RATE } = require("../utilities/config");

class Block {
  constructor({ timestamp, transactions, hash, lastHash, nonce, difficulty }) {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.hash = hash;
    this.lastHash = lastHash;
    this.nonce = nonce;
    this.difficulty = difficulty;
  }

  static genesis() {
    // return new Block(GENESIS_DATA);
    return new this(GENESIS_DATA);
  }

  static mineBlock({ lastBlock, transactions }) {
    let timestamp, hash;
    const lastHash = lastBlock.hash;
    let { difficulty } = lastBlock;
    let nonce = 1024;

    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficultyLevel({
        originalBlock: lastBlock,
        timestamp,
      });
      hash = crypto(timestamp, lastHash, transactions, nonce, difficulty);
    } while (
      hexToBinary(hash).substring(0, difficulty) !== "0".repeat(difficulty)
    );

    return new this({
      timestamp,
      lastHash,
      transactions,
      difficulty,
      nonce,
      hash,
    });
  }
  static adjustDifficultyLevel({ originalBlock, timestamp }) {
    // console.log(originalBlock);
    const { difficulty } = originalBlock;

    if (difficulty < 1) return 1;
    if (timestamp - originalBlock.timestamp > MINE_RATE) return difficulty - 1;

    return difficulty + 1;
  }
}

module.exports = Block;
