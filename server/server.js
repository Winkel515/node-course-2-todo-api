require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const bcrypt = require('bcryptjs');

var {mongoose} = require('./db/mongoose.js')
var {Todo} = require('./model/todo');
var {User} = require('./model/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;

    if(ObjectID.isValid(id)){
        Todo.findOne({
            _id: id,
            _creator: req.user._id
        }).then((todo) => {
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

app.delete('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;

    if(ObjectID.isValid(id)){
        Todo.findOneAndRemove({
            _id: id,
            _creator: req.user._id
        }).then((todo) => {
            if(todo){
                res.send({todo});
            } else{
                res.status(404).send();
            }
        })
    } else{
        res.status(400).send();
    }
});

app.patch('/todos/:id', authenticate, (req, res) => {
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

    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
    }, {$set: body}, {new: true}).then((todo) => {
        if(!todo) {
            res.status(404).send();
        } else {
            res.send({todo});
        } 
    }).catch((e) => {
        res.status(400).send();
    })
})

app.post('/todos', authenticate, (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id // authenticate allows me to setup a creator id for todo using their token
    })

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);
    
   user.save().then(() => {
        return user.generateAuthToken();
   }).then((token) => {
       res.header('x-auth', token).send(user);
   }).catch((e) => {
       res.status(400).send(e);
   })
})

app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    
    User.findByCredentials(body.email, body.password).then((user) => {
        res.header('x-auth', user.generateAuthToken()).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    })
})

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
})

app.delete('/users/me/logout', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }).catch((e) => res.status(400).send());
})

app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});

module.exports = {app};