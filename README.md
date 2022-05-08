# Proof of Work Chain

This is an example Proof of Work Chain over a client/server model. The application requires public / private key digital signature authentication to unlock and use a mining dashboard.

## How it Works
The application assumes the client holds both their own public and private keys. When a user authenticates with their public key, a digital signature is generated using the associated private key, and sent to the server to verify key ownership. The public key entered is then matched to a stored public key on the server.

Once a user is authenticated, a mining dashboard display is revealed. The client will be permitted to start and stop their miner, as well as view their mining address balance. Mining is not permitted without prior authentication.

## Start the Server

First, install all dependencies with `npm i` from the root directory in the terminal. Then, start the server with `node index` or `nodemon index`. This starts the server at port `3032` by default.

## Start the Client
The client is compiled with [parceljs](https://en.parceljs.org/getting_started.html). To start the client in development mode at http://localhost:1234/ by default, open a new terminal from any project directory and enter: 
```bash
npm run dev
```
To build for production, run:

```bash
npm run build
```


## Utilities

There are some `/scripts/` which can be used as utilities for your Proof of Work chain: 

- `generate.js` - This will generate you a new public/private keypair `node generate`
- `getBalance.js` - Once authenticated, this will get the balance of a public key passed in from the command line: i.e. `node getBalance --address 049a1bad614bcd85b5f5c36703ebe94adbfef7af163b39a9dd3ddbc4f286820031dfcb3cd9b3d2fcbaec56ff95b0178b75d042968462fbfe3d604e02357125ded5`
- `startMining.js` - Once authenticated, this starts the miner on the server `node startMining`
- `stopMining.js` - Once authenticated, this stops the miner on the server `node stopMining`
