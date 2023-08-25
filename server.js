const express = require("express");
const blockchain = require("./routes/blockchain-routes");
const block = require("./routes/block-routes");
const transaction = require("./routes/transaction-routes");
const node = require("./routes/node-routes");

const app = express();

const PORT = process.argv[2];

app.use(express.json());

app.use("/api/blockEstate", blockchain);
app.use("/api/block", block);
app.use("/api/transaction", transaction);
app.use("/api/node", node);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
