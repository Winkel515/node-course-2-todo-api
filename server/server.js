require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose.js')
var {Todo} = require('./model/todo');
var {User} = require('./model/user');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;

    if(ObjectID.isValid(id)){
        Todo.findById(id).then((todo) => {
            if(todo){
                res.send({todo});
            } else {
                res.status(404).send('Could not find todo');
            }
        })
    } else {
        res.status(400).send('ID is invalid');
    }
})

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;

    if(ObjectID.isValid(id)){
        Todo.findByIdAndRemove(id).then((todo) => {
            if(todo){
                res.send({todo});
            } else{
                res.status(404).send('Could not find todo');
            }
        })
    } else{
        res.status(400).send('ID is invalid');
    }
});

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if(!ObjectID.isValid(id)){
        return res.status(400).send();
    }

    if(body.completed){
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if(!todo) {
            res.status(404).send();
        } else {
            res.send({todo});
        } 
    }).catch((e) => {
        res.status(400).send();
    })
})

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    })

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});

module.exports = {app};