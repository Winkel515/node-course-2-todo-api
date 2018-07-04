const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/model/todo');
const {User} = require('./../server/model/user');

// var id = '5b3b0eb788d1191270353752';

// if(!ObjectID.isValid(id)){
//     console.log('Id not valid')
// }

// Todo.find({
//     _id: id //don't need to convert into ObjectID with mongoose
// }).then((todos) => {
//     console.log('Todos:', todos);
// })

// Todo.findOne({
//     _id: id //don't need to convert into ObjectID with mongoose
// }).then((todo) => {
//     console.log('Todo:', todo);
// })

// Todo.findById(id).then((todo) => {
//     if(!todo){
//         return console.log('Id not found');
//     }
//     console.log('Todo by ID:', todo)
// }).catch((e) => console.log(e))

User.findById('5b35869d924b7b20a4464fc2').then((user) => {
    if(!user){
        return console.log('User not found');
    }
    console.log(JSON.stringify(user, undefined, 2));
}).catch((e) => console.log(e))