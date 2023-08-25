const express = require("express");
const blockchain = require("./routes/blockchain-routes");

const app = express();

const PORT = process.argv[2];

app.use(express.json());

app.use("/api/blockEstate", blockchain);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
