const Blockchain = require("../models/blockchain");
const { v4: uuidv4 } = require("uuid");

const blockEstate = new Blockchain();
const nodeAddress = uuidv4().split("-").join("");

module.exports = { blockEstate, nodeAddress };
