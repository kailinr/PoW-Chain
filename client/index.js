import "./index.scss";
const {msgHex, signature} = require('./crypto')

let addressInput;

////////////// CLIENT /////////////////

/////// GET ADDRESS //////
document.getElementById("addressSubmit").addEventListener('click', () => {
  addressInput = document.querySelector("#address").value;
  const msg = "This is a verification Message"
  /////// SIGN //////
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

  /////// VERIFIY REQUEST //////
  fetch(request)
    .then(response => {
      return response.json();
    }).then(response => {
    /////// DOM //////
    if (response.isValid == true) {
      console.log('Successfully Authenticated');
      document.querySelector('#mining').classList.remove('hide')
      const verify = document.querySelector('.verify');
      verify.innerText = 'Successfully Verified!';
      verify.classList.add('success');
      const addressdiv = document.querySelector('#addressdiv');
      addressdiv.classList.add('hide');
      const remove = () => {
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

//StartMining
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

//StopMining
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
