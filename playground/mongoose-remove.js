const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/model/todo');
const {User} = require('./../server/model/user');

// Todo.remove({}) remove everything that matches and return a promise that contains removal error
// Todo.findOneAndRemove({}) removes first item that matches and return a promise that contains the removed thing
// Todo.findByIdAndRemove({}) You know what this does

