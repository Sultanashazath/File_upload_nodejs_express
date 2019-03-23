const express=require('express');
const router= express.Router()
const mongoose=require('mongoose');

var Order=require('../models/order')
const Product=require('../models/product')
router.get('/',(req,res,next)=>{
    Order.find().
    then(result=>{
        res.status(200).json({
            message:"orders were created",
            order:result
        })
            })
    .catch(err=>{
        console.log(err);
        res.status(501).json(result);
    })
   
})
// router.post('/',(req,res,next)=>{
//     Product.findById(req.body.productId)
//     .then(product=>{
//    const orders=new Order({
//         _id:mongoose.Types.ObjectId(),
//         product:req.body.product,
//         quantity:req.body.quantity
//     })
//     return orders.save()
//     })
//     .then(result=>{
//         res.status(200).json({
//             message:"orders were created",
//             order:result
//         })
//     })
//     .catch(err=>{
//         console.log(err);
//         res.status(501).json(err);
    
// })
    
// })
router.post("/", (req, res, next) => {
    Product.findById(req.body.productId)
      .then(product => {
        if (!product) {
          return res.status(404).json({
            message: "Product not found"
          });
        }
        const order = new Order({
          _id: mongoose.Types.ObjectId(),
          quantity: req.body.quantity,
          product: req.body.productId
        });
        return order.save();
      })
      .then(result => {
        console.log(result);
        res.status(201).json({
          message: "Order stored",
          createdOrder: {
            _id: result._id,
            product: result.product,
            quantity: result.quantity
          },
          request: {
            type: "GET",
            url: "http://localhost:3000/orders/" + result._id
          }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });
  
router.get('/:orderId',(req,res,next)=>{
    const id=req.params.productId;
    
        res.status(200).json({
            message:'orderId Details',
            Id: req.params.id
        })
})
router.delete('/:orderId',(req,res,next)=>{
    const id=req.params.productId;
    
        res.status(200).json({
            message:'orderId delete',
            Id: req.params.id
        })
})
module.exports=router;