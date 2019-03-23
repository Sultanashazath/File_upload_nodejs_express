const jwt=require("jsonwebtoken");
const key="Ayssan"
module.exports=(req,res,next)=>{
    // res.writeHead(200, {"Content-Type": "application/json"});
    try{
      const token=req.headers.authorization.split(" ")[1];  
        const decoded=jwt.verify(token,key)
        req.userData=decoded;
        next();
  }catch(error)
    {console.log("failer")
        return res.status(505).json({
            message:"Errorn saving data",
            Error:err
            })
    }  next();
}

