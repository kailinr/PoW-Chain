import "./index.scss";
const {msgHex, signature} = require('./crypto')

let addressInput;

////////////// CLIENT /////////////////

//GetAddress Button
document.getElementById("addressSubmit").addEventListener('click', () => {
  addressInput = document.querySelector("#address").value;
  const msg = "This is a verification Message"
  /////// Sign Message //////
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

  /////// VERIFIED //////
  fetch(request)
    .then(response => {
      return response.json();
    }).then(response => {
    /////// DOM //////
    if (response.isValid == true) {
      console.log('Successfully Authenticated');
      const verify = document.querySelector('.verify');
      const addressdiv = document.querySelector('#addressdiv'); //hide button
      verify.innerText = 'Successfully Verified!';
      const remove = () => {
        // addressdiv.classList.add('hide');
        verify.innerText = "";
      }
      setTimeout(() => remove(), 2000);
    } else throw new Error('isValid False: Verification Failed');
  }).catch(e => {
    console.log(e.message);
    alert(`Verification Failed - You are not authorized. Please try again.`);
  });

});

function getBalance() {
 
  const address = addressInput;
    
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
    })

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
      alert(`Success! Started @ block ${blockNumber}`);
    }).catch(e => {
      console.log(e.message);
      console.log('Unauthorized Mining Request')
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
