const express = require('express');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');
require('dotenv/config');  // Do 'npm install dotenv' before using this.

const app = express();

// Import routes
const schema = require('./schema/schema');

// Connect to the database
mongoose.connect(process.env.connection_string,{ useNewUrlParser: true ,useUnifiedTopology: true},(err)=>{
    if(err){
        console.log(err);
    }else{
        // First database should connect then only the server should start listening
        app.listen(8080,function(error){
            if(error){
                console.log(error);
            }
            else{
                console.log('Server listening at 8080');
            }
        });
        console.log('Connected to the database');
    }
});

// Middleware
app.use('/graphql',graphqlHTTP({
    schema,
    graphiql: true
}));


