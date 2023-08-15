const { v4: uuidv4 } = require("uuid");
const { verifySignature } = require("../utilities");

class Transaction {
  constructor({ sender, recipient, amount, propertyId = null }) {
    this.id = uuidv4();
    this.outputMap = this.createMap({ sender, recipient, amount, propertyId });
    this.input = this.createInput({ sender, outputMap: this.outputMap });
  }

  createMap({ sender, recipient, amount, propertyId }) {
    const map = {};
    map[recipient] = amount;

    if (propertyId) {
      map[sender].propertyId = propertyId;
    }
    map[sender.publicKey] = sender.balance - amount;
    return map;
  }

  createInput({ sender, outputMap }) {
    return {
      timestamp: Date.now(),
      amount: sender.balance,
      address: sender.publicKey,
      signature: sender.sign(outputMap),
    };
  }
  static validateTransaction(transaction) {
    const {
      input: { address, amount, signature },
      outputMap,
    } = transaction;
    const total = Object.values(outputMap).reduce(
      (total, amount) => total + amount,
      0
    );
    if (amount !== total) {
      return false;
    }
    if (!verifySignature({ publicKey: address, data: outputMap, signature })) {
      return false;
    }
    return true;
  }

  update({ sender, recipient, amount, propertyId }) {
    if (amount > this.outputMap[sender.publicKey]) {
      throw new Error("Not enough funds");
    }

    if (!this.outputMap[recipient]) {
      this.outputMap[recipient] = amount;
    } else {
      this.outputMap[recipient] = this.outputMap[recipient] + amount;
    }
    if (propertyId) {
      this.outputMap[recipient].propertyId = propertyId;
    }
    this.outputMap[sender.publicKey].amount -= amount;

    this.input = this.createInput({ sender, outputMap: this.outputMap });
  }
}

module.exports = Transaction;
