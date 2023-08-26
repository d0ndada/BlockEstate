const express = require("express");
const blockchain = require("./routes/blockchain-routes");
const block = require("./routes/block-routes");
const transaction = require("./routes/transaction-routes");
const node = require("./routes/node-routes");
const consensus = require("./routes/consensus-route");

const app = express();

const PORT = process.argv[2];

app.use(express.json());

app.use("/api/blockEstate", blockchain);
app.use("/api/block", block);
app.use("/api/transaction", transaction);
app.use("/api/node", node);
app.use("api/consensus", consensus);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
