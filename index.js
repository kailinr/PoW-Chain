const {startMining, stopMining} = require('./mine');
const {PORT, PUBLIC_KEY} = require('./config');
const {utxos, blockchain} = require('./db');
const express = require('express');
const app = express();
const cors = require('cors');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

app.use(cors());
app.use(express.json());

////////////// SERVER /////////////////

app.post('/', (req, res) => {
  const {method, params} = req.body;

/////// Handle Verification //////
   if(method === 'verifyAddress') {
    const [PUB, MESSAGE, SIG] = params;
    const pubKey = ec.keyFromPublic(PUB, 'hex');
    const isValid = pubKey.verify(MESSAGE, SIG);
    if (PUB === PUBLIC_KEY && isValid === true) {
      //set isvalid variable
      app.locals.isValid = true;
    res.send({isValid: isValid, addressInput: PUB}); 
    }
    return;
}
  if(method === 'startMining' && app.locals.isValid) {
    console.log("Start Mining Authentication:", app.locals.isValid);
      startMining();
      res.send({ blockNumber: blockchain.blockHeight() });
      return;
  }
  if(method === 'stopMining' && app.locals.isValid) {
    console.log("Stop Mining Authentication:", app.locals.isValid);
      stopMining();
      res.send({ blockNumber: blockchain.blockHeight() });
      return;
  }

  if(method === "getBalance") {
      const [address] = params;
      
      const ourUTXOs = utxos.filter(x => {
        return x.owner === address && !x.spent;
      });
      const sum = ourUTXOs.reduce((p,c) => p + c.amount, 0);
      res.send({ balance: sum.toString()});
  }
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`);
});
