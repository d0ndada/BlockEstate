const express = require("express");
const { blockEstate, nodeAddress } = require("./utilities/config");

const blockchain = require("./routes/blockchain-routes");
const block = require("./routes/block-routes");
const transaction = require("./routes/transaction-routes");
const node = require("./routes/node-routes");
const consensus = require("./routes/consensus-routes");
const property = require("./routes/property-routes");
const actionsProperty = require("./routes/propertyActions-routes");

const app = express();

const PORT = process.argv[2];

app.use(express.json());

app.use("/api/blockchain", blockchain);
app.use("/api/block", block);
app.use("/api/consensus", consensus);
app.use("/api/node", node);
app.use("/api/transaction", transaction);
app.use("/api/property", property);
app.use("/api/property", actionsProperty);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
