var mongoose = require('mongoose');

var Todo = mongoose.model('todo', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    },
    _creator: { //This is setup a connection between User and Todo
        required: true,
        type: mongoose.Schema.Types.ObjectId,
    }
});

module.exports = {Todo};