import "./index.scss";
const {PUBLIC_KEY} = require('../config');

function getBalance() {
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
