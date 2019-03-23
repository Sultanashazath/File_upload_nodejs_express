const express =require('express');
const app= express();
const morgan=require('morgan')
const bodyParser=require('body-parser')
const mongoose=require('mongoose')

productroutes=require('./api/routes/products')
orderproducts=require('./api/routes/order')
usersignup=require('./api/routes/user')
url="mongodb://127.0.0.1:27017/Example"
mongoose.connect(url)

app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'))
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
// app.use((req,res,next)=>{
    // res.header('Access-Control-Allow-Orgin','*');
    // res.header("Access-Control-Allow-Headers","Orgin,X-Requested-With,Content-Type,Authorization");
    // if(req.method==='OPTIONS'){
    //     res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET')
    //     res.status(200).json({})
    // }
// })
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
    }
    next();
  });

app.use('/products',productroutes)
app.use('/orders',orderproducts)
app.use('/',usersignup)

app.use((req,res,next)=>{
    const error=new Error('Not Found');
    error.status=404
    next(error)
})

app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error:{message:error.message}
    })
})

module.exports=app;