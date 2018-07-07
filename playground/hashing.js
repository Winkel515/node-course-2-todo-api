const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc';

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);
    })
})

var hashPassword = '$2a$10$HmYsi46jPGRxE0MCFXD.mu7pfcFaxm7E5OMhZt1/jk/77UhgHtF4.';

bcrypt.compare(password, hashPassword, (err, res) => {
    console.log(res);
})

// var data = {
//     id: 10
// }

// var token = jwt.sign({
//     data: 'Shit'
// }, '123abc');
// var decoded = jwt.verify(token, '123abc');

// console.log(token);
// console.log(decoded);

// var message = 'I am user number 3';
// var hash  = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// var data = {
//     id: 4
// }
// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'salt').toString() //adding a secret salt to the hash so that people can't inject their own hash
// }

// var resultHash = SHA256(JSON.stringify(token.data) + 'salt').toString();

// if(resultHash === token.hash){
//     console.log('Data was not changed');
// } else {
//     console.log('Data was changed. Don\'t trust!!!');
// }