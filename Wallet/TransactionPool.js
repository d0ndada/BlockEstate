class TransactionPool {
  constructor() {
    this.transactionMap = {};
  }
  addTransaction(transaction) {
    this.transactionMap[transaction.id] = transaction;
  }
  replacePool(transactions) {
    this.transactionMap = transactions;
  }
  transactionExist({ address }) {
    const transaction = Object.values(this.transactionMap);
    return transaction.find(
      (transaction) => transaction.input.address === address
    );
  }
}

module.exports = TransactionPool;
