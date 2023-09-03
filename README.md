# RealEstateChain
A blockchain-based solution for managing real estate transactions, ensuring transparency, security, and trust.

## Overview
RealEstateChain is a prototype blockchain system designed to handle property transactions. By leveraging the immutability and transparency of blockchain technology, RealEstateChain aims to streamline the property buying/selling process, reduce fraud, and increase trust among parties.

> **Note:** In this concept, the nodes will be run by the persons who work on the BlockEstate firm. When they mine a block, they receive a commission for the transaction.

## BlockEstate API Endpoints

### Block Routes
- **POST** `/api/block` - Create a new block.
- **GET** `/api/block/:hash` - Retrieve a block by its hash.

### Blockchain Routes
- **GET** `/api/blockchain` - Retrieve the entire blockchain.
- **GET** `/api/blockchain/approve` - Mine a new block.

### Consensus Routes
- **GET** `/api/consensus` - Reach consensus among network nodes.

### Node Routes
- **POST** `/api/node/register-node` - Register a new node.
- **POST** `/api/node/register-nodes` - Register multiple nodes.
- **POST** `/api/node/register-broadcast-node` - Broadcast the node to the network.

### Property Routes
- **GET** `/api/property/status/:id` - Retrieve the status of a property by its ID.
- **GET** `/api/property/bids/:id` - Retrieve ongoing bids for a property by its ID.
- **GET** `/api/property/history/:id` - Retrieve the history of a property by its ID.
- **GET** `/api/property/sold` - Retrieve all sold properties.
- **GET** `/api/property/listed/record` - Retrieve all recorded listings.
- **GET** `/api/property/listed/live` - Retrieve all active listings.
- **GET** `/api/property/biddings` - Retrieve all biddings.

### Property Actions Routes
- **POST** `/api/property/list` - List a property.
- **POST** `/api/property/bid` - Create a bid for a property.
- **POST** `/api/property/acceptBid` - Accept a bid for a property.
- **POST** `/api/property/relist` - Relist a property.
- **POST** `/api/property/deleteListing` - Delete a property listing.

### Transaction Routes
- **POST** `/api/transaction/broadcast` - Broadcast a transaction.
- **POST** `/api/transaction/broadcast-transaction` - Create a new transaction.
- **GET** `/api/transaction/:id` - Retrieve a transaction by its ID.
