const express = require('express');
const trackRoute = express.Router();
const cors = require('cors');
const mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const { fork } = require('child_process');
const database = require('./databaseInit');
const CONFIG = require('./CONFIG');

const app = express();
app.use('/tracks', trackRoute);
app.use(cors());

let url = "mongodb://localhost/trackDB";
let db;

async function serve(){
    try{
        db = await database.connectDatabase();
    }
    catch(err){
        console.log(err);
    }

    console.log("Database connected...");

    try{
        await database.initialize(db);
    }
    catch(err){
        console.log(err, ": Database Cannont Be initialized");
    }

    require('./routes')(trackRoute, db);

    const forked = fork('src/server/child.js', []);

    app.listen('3005', () => {
        console.log("App listening to port 3005!");
    });
}

serve();