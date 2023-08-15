const { verifySignature } = require("../utilities");
const Wallet = require("./Wallet");
const Transaction = require("./Transaction");

describe("Wallet", () => {
  let wallet;

  beforeEach(() => {
    wallet = new Wallet();
  });

  it("should have a balance", () => {
    expect(wallet).toHaveProperty("balance");
  });
  it("should have a publickey", () => {
    expect(wallet).toHaveProperty("publicKey");
  });

  describe("signing data", () => {
    const data = "Avengers";

    it("should verify a valid signature", () => {
      expect(
        verifySignature({
          publicKey: wallet.publicKey,
          data,
          signature: wallet.sign(data),
        })
      ).toBe(true);
    });
    describe("create transactions", () => {
      describe("and the amount that exceeds the funs", () => {
        it("throws an error", () => {
          expect(() =>
            wallet.createTransaction({ amount: 10000, recipient: "Tony" })
          ).toThrow("Not enough funds");
        });
      });
      describe("and the amount is valid", () => {
        let transaction, amount, recipient;

        beforeEach(() => {
          amount = 100;
          recipient = "Danny";
          transaction = wallet.createTransaction({ amount, recipient });
        });
        it("it creates a new instance with the wallet ", () => {
          expect(transaction instanceof Transaction).toBe(true);
        });

        it("matches the input with the wallet", () => {
          console.log(
            `input address: ${transaction.input.address} `,
            `wallet key: ${wallet.public} `
          );
          expect(transaction.input.address).toEqual(wallet.publicKey);
        });
        it("displays the amount to the recipient", () => {
          console.log(
            `Recipient: ${transaction.outputMap[recipient]}`,
            `Amount: ${amount} `
          );
          expect(transaction.outputMap[recipient]).toEqual(amount);
        });
      });
    });
  });
});
