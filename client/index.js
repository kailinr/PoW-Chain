import "./index.scss";
const {PUBLIC_KEY} = require('../config'); //PUBCLIC used by getBalance todo:fix
const {msgHex, signature} = require('./crypto')

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
  const PUB = PUBLIC_KEY  //todo: repaste String(addressInput)
  //String(addressInput)
  
  const params = {
    method: "verifyAddress",
    params: [PUB, MESSAGE, SIG],
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
      console.log(response.isValid);
      //Verification DOM
      const statusText = response.isValid === true 
        ? 'Successfully Verified!'
        : alert(`Verification Failed - You are not authorized`);
        document.querySelector(".verify").textContent = statusText;
    }).catch(e => console.log(e.message));

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
