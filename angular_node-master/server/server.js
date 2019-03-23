require('./config/config');
require('./models/db');
require('./config/passportConfig')
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
 var passport = require('passport')
var rtsIndex = require('./routes/index.routes')

var app = express();

app.use(bodyParser.json());
app.use(cors());
app.use('/api',rtsIndex)
app.use(passport.initialize())

app.use((err,req,res,next)=> {
    if (err.name === 'ValidationError') {
        var valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(422).send(valErrors)
    }
    else{
        console.log(err);
    }
})
app.listen(process.env.PORT,()=>{
    console.log(`Server started at port : ${process.env.PORT}`);
})

