const express=require('express');
const router= express.Router()
const mongoose =require('mongoose');
const multer=require('multer')
const fs = require('fs');

const checkAuth=require('../middleware/check-auth')
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads/');
    },
    filename:function(req,file,cb){
        cb(null,new Date().toISOString()+file.originalname);
    }
})
const fileFilter=(req,file,cb)=>{
    if(file.mimetype==='image/jpeg' || file.mimetype==='image/png'){
        cb(null,true);
    }
    else{
    cb(null,false);
    }
}
const upload=multer({storage:storage,limits:{
    fileSIze:1024 *1024 *5
    },
    fileFilter:fileFilter
})
const Product=require('../models/product')
router.get('/',(req,res,next)=>{
    Product.find()
    .select("name price _id productImage")
    .exec()
    .then(doc=>{
        console.log(doc);
        res.status(201).json({
            message:'all Files',
            result:doc
     });
    }).catch(err=>{
        console.log(err)
        res.status(500).json({error:err})
    })
})
//     router.post('/',upload.single('productImage'),checkAuth,(req,res,next)=>{
//         console.log("req.file",req.file)
//         const product=new Product({
//         _id:new mongoose.Types.ObjectId(),
//         name:req.body.name,
//         price:req.body.price,
//         productImage:req.file.path,
//     })
//     product.save().then(result=>{
//         console.log(result);
//         res.status(200).json({
//             message:"handling get request to /product",
//            cretaedprdoct:product 
//         })
//     }).catch(err=>{
//         console.log(err)
//         res.status(500).json({
//             error:err,
            
           
//         })
//     })
// })

router.post("/",  upload.single('productImage'), checkAuth,(req, res, next) => {
            
    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      price: req.body.price,
      productImage: req.file.path 
    });
    product
      .save()
      .then(result => {
        console.log("result***********",result);
        res.end(JSON.stringify({
          message: "Created product successfully",
        //   createdProduct: {
        //       name: result.name,
        //       price: result.price,
        //       _id: result._id,
        //       request: {
        //           type: 'GET',
        //           url: "http://localhost:3000/products/" + result._id
        //       }
        //   }
        }))
    })
        .catch(err => {
        console.log(err);
        res.status(500).json({
        //   error: err
        });
      });
  });





router.get('/:productId',(req,res,next)=>{
    const id=req.params.productId;
    fs.unlink("./uploads/"+id, (err) => {
        if (err){
            res.status(404).json({
                message:"Error File not found ",
                Error:err
            })
        }
        else{
            console.log("succes");
            res.status(200).json({
                message:"Successfully Deleted",
            })
        }
    })
    // Product.findById(id)
    // .select('name price _id productImage')
    // .exec()
    // .then(doc=>{
    //     console.log(doc);
    //     res.status(201).json({
    //         message:'you  discovered',
    //         result:doc
            
    //     });
    // }).catch(err=>{
    //     console.log(err)
    //     res.status(500).json({error:err})
    // })
})
  
// const deleteFile = (file) => {
//        fs.unlink("path/to/file/folder/"+file, (err) => {
//            if (err) throw err;
//        }
// }
   router.get('/:productId',(req,res,next)=>{
    const id=req.params.productId;
    Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then(doc=>{
        console.log(doc);
        res.status(201).json({
            message:'you  discovered',
            result:doc
            
        });
    }).catch(err=>{
        console.log(err)
        res.status(500).json({error:err})
    })
})
    router.patch('/:productId',(req,res,next)=>{
        const id=req.params.productId;
        const updateOps={}
        for(const ops of req.body){
            updateOps[ops.propName]=ops.value;
        }
        Product.update({_id:id},{$set:updateOps})
        .exec()
        .then(result=>{
            console.log(result);
            res.status(200).json(result);
        })
    })
    router.delete('/:productId',checkAuth,(req,res,next)=>{
        const id=req.params.productId;
        Product.remove({_id:id}).exec().
        then(result=>{
            res.status(200).json({message : result})
        })
        .catch(err=>{
            res.status(500).json({Error : err})
        })
        
    })
module.exports=router;