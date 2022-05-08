const {startMining, stopMining} = require('./mine');
const {PORT} = require('./config');
const {utxos, blockchain} = require('./db');
const express = require('express');
const app = express();
const cors = require('cors');
const {PRIVATE_KEY} = require('./config');

app.use(cors());
app.use(express.json());

////////////// SERVER /////////////////

app.post('/', (req, res) => {
  const {method, params} = req.body;
  if(method === 'startMining') {
      startMining();
      res.send({ blockNumber: blockchain.blockHeight() });
      return;
  }
  if(method === 'stopMining') {
      stopMining();
      res.send({ blockNumber: blockchain.blockHeight() });
      return;
  }
  //Temp Address Verification
  if(method === 'verifyAddress') {
    const [PUB, SIG, MESSAGE] = params;

    //toDo: create verifyaddress() function

    res.send({privateKey: PRIVATE_KEY}); //todo: change this to 'True/false' verification result
    return;
}
  if(method === "getBalance") {
      const [address] = params;
      //later - add verify address here
  
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
