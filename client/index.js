import "./index.scss";
const {PUBLIC_KEY} = require('../config'); //PUBCLIC used by getBalance todo:fix
const {pub, msgHex, signature} = require('./crypto')

let addressInput;

//GetAddress Button
document.getElementById("addressSubmit").addEventListener('click', () => {
  //DOM
  addressInput = document.querySelector("#address").value; //publicAddress
  const msg = "This is a test"
  //document.querySelector(".msg").value; //todo: create msg in DOM

  //Sign Message
  const MESSAGE = msgHex(msg)
  const SIG = signature(MESSAGE)
  const PUB = pub(addressInput) 
  console.log('MESSAGE:', MESSAGE);
  console.log('SIGNATURE:', SIG);
  console.log('PUB', PUB);
  

  
  const params = {
    method: "verifyAddress",
    params: [addressInput],
    jsonrpc: "2.0", 
    // id: 1
  }

  const request = new Request('http://localhost:3032/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });

  fetch(request)
    .then(response => {
      return response.json();
    }).then(response => {
      //todo: privateKey Prints - fix 
      console.log(response);
    //todo: change to verification result message
      document.querySelector(".verify").innerHTML = response.privateKey;

      // alert(`Your Verification Status is ${privateKey}`);
    });
});



function getBalance() {
  //todo: pass public from DOM public 
  const address = PUBLIC_KEY;

  const params = {
    method: "getBalance",
    params: [address],
    jsonrpc: "2.0",
    id: 1
  }

  const request = new Request('http://localhost:3032/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });

  fetch(request)
    .then(response => {
      return response.json();
    }).then(response => {
      document.getElementById("balance").innerHTML = response.balance;
    });
}

setInterval(getBalance, 1000);

//StartMining Button
document.getElementById("start-mining").addEventListener('click', () => {
  const request = new Request('http://localhost:3032/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ method: 'startMining' })
  });

  fetch(request)
    .then(response => {
      return response.json();
    }).then(({blockNumber}) => {
      alert(`Started @ block ${blockNumber}`);
    });
});

//StopMining Button
document.getElementById("stop-mining").addEventListener('click', () => {
  const request = new Request('http://localhost:3032/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ method: 'stopMining' })
  });

  fetch(request)
    .then(response => {
      return response.json();
    }).then(({blockNumber}) => {
      alert(`Stopped @ block ${blockNumber}`);
    });
});
