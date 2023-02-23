const Web3 = require('web3');
const web3 = new Web3('ws://127.0.0.1:8545');

let  eventSig = web3.utils.keccak256('MessageSent(bytes)');
console.log(`sig is ${eventSig}`);

web3.eth.subscribe('logs', {
    address: '0xC0a4b9e04fB55B1b498c634FAEeb7C8dD5895b53',
    topics: [eventSig]
}, (error, result) => {
    if (error)
        console.error(error);
})
    .on("connected", function (subscriptionId) {
        console.log(subscriptionId);
    })
    .on("data", function (log) {
        console.log(log);
    });
