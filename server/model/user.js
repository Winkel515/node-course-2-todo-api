const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var secret = 'abc123';

var UserSchema = new mongoose.Schema({
    email: {
        required: true,
        trim: true,
        type: String,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            require: true
        }
    }]
})

UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, secret);

    user.tokens = user.tokens.concat([{access, token}]);
    
    user.save();
    return token;
}

UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;

    try{
        decoded = jwt.verify(token, secret);
    } catch(e){
        return Promise.reject();
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    })
}

var User = mongoose.model('User', UserSchema);

module.exports = {User}