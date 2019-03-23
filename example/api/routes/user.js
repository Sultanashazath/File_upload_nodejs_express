const express=require('express');
const router= express.Router()
const mongoose=require('mongoose');
const bcrypt=require("bcrypt")
const key="Ayssan"
const User=require('../models/user')
const jwt=require('jsonwebtoken')
router.post('/signup',(req,res)=>{
    console.log(req.body.email)
    bcrypt.hash(req.body.password,10,function(error,hash){
            if(error){res.status(505).json({
                message:"Error in hashing",
                Error:error
            })
            }else{
            const user=new User({
                _id: mongoose.Types.ObjectId(),
                email:req.body.email,
                password:hash
            })
            console.log("req.body.email",req.body.email)
                user.save().then(result=>{
                    if(result){res.status(200).json({
                        message:"success",
                        result:result,
                        hash:hash
                    })
                }
                }).catch(err=>{
                    if(err){res.status(505).json({
                        message:"Errorn saving data",
                        Error:err
                        })
                    }}) 
            }}
         )
})
router.post('/login',(req,res)=>{
     User.find({email:req.body.email}).then(user=>{
         console.log("user",user[0]._id)
         if(user.length<0){
             res.status(404).json({
                 messagge:"Not found Valid maill id User"
             })
         }
         else{
             bcrypt.compare(req.body.password,user[0].password,(error,result)=>{
                 if(error){
                     res.status(501).json({
                         message:"Authendication error"
                     })
                 }
                 console.log("bcrypt compare" +result)
                 if(result){
                   const Token= jwt.sign({email:user[0].email,
                                userId:user[0]._id},key,{
                                    expiresIn:"1 hr"
                                })
                    
                    res.status(201).json({
                        message:"Authendication Successfulll",
                        token:Token
                    })
                }
             })
         }
     }).catch(err=>{
        if(err){res.status(505).json({
            message:"Errorn in Authedictaion",
            Error:err
            })
        }

     })
})
router.get('/',(req,res,next)=>{
    User.find({}).then(result=>{
        res.status(200).json({
            message:result
    })
 })
})
router.delete('/:userid',(req,res)=>{
    User.remove({_id:req.params.userid})
    .exec()
    .then(result=>{
        if(result){res.status(200).json({
            message:"success",
            result:result,
         })
       }
    }).catch(err=>{
        if(err){res.status(505).json({
            message:"Errorn deleting data",
            Error:err
            })
        }}) 

 
})


module.exports=router;