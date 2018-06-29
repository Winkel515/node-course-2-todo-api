// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); //This code is identical as the code above

MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, (err, client) => {
    if(err){
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');

    // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
    //     console.log(result);
    // })

    // db.collection('Users').deleteMany({name: 'Winkel'});

    db.collection('Users').findOneAndDelete({_id: new ObjectID("5b34fcfd99f9911f184ece0a")}).then((result) => {
        console.log(JSON.stringify(result, undefined, 2))
    });

    client.close();
});