import "./index.scss";
const {PUBLIC_KEY} = require('../config'); // by getBalance todo:fix
const {msgHex, signature} = require('./crypto')


////////////// CLIENT /////////////////

//GetAddress Button
document.getElementById("addressSubmit").addEventListener('click', () => {
  const addressInput = document.querySelector("#address").value;
  const msg = "This is a test"

  //Sign Message
  const MESSAGE = msgHex(msg)
  const SIG = signature(MESSAGE)
  const PUB = addressInput
  
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

    
    /////// DOM //////

    if (response.isValid == true) {
      console.log(response.isValid);
      console.log(response.addressInput);
      document.querySelector('.verify').innerText = 'Successfully Verified!';
      
      // const statusText = response.isValid === true 
      //   ? 'Successfully Verified!'
      //   : alert(`Verification Failed - You are not authorized`);
      //   document.querySelector(".verify").textContent = statusText;
    } else {
      throw new Error('isValid False: Verification Failed');
    }
  }).catch(e => {
    console.log(e.message);
    alert(`Verification Failed - You are not authorized. Please try again.`);
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
