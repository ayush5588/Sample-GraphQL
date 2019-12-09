const mongoose = require('mongoose');
require('dotenv/config');
mongoose.connect(process.env.connection_string,{ useNewUrlParser: true ,useUnifiedTopology: true},(err)=>{
    if(err){
        console.log(err);
    }else{
        console.log('Connected to the database');
    }
});

//module.exports = con;

