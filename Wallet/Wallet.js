const { INITIAL_BALANCE } = require("../utilities/config");

const { ec } = require("../utilities");
const crypto = require("../utilities/hash");
const Transaction = require("./Transaction");
class Wallet {
  constructor() {
    this.balance = INITIAL_BALANCE;
    this.properties = [];

    this.keyPair = ec.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode("hex");
  }

  sign(data) {
    return this.keyPair.sign(crypto(data));
  }

  ownsProperty(propertyId) {
    return this.properties.includes(propertyId);
  }
  addProperty(propertyId) {
    this.properties.push(propertyId);
  }
  removeProperty(propertyId) {
    this.properties = this.properties.filter((id) => id !== propertyId);
  }

  createTransaction({ amount, recipient }) {
    if (amount > this.balance) {
      throw new Error("Not enough funds");
    }
    if (propertyId && !this.ownsProperty(propertyId)) {
      throw new Error("Thsi property don't belong to the wallet");
    }
    const transaction = new Transaction({ sender: this, recipient, amount });

    if (propertyId) {
      transaction.outputMap[recipient].propertyId = propertyId;
      this.removeProperty(propertyId);
    }
    return transaction;
  }
}

module.exports = Wallet;
