var mongoose =require('mongoose');
var User = mongoose.model('User')
var passport = require('passport')
var _ = require('lodash')



module.exports.register = (req,res,next)=> {
    console.log("inside register fn");

    var user = new User();
    user.fullName = req.body.fullName;
    user.lastName = req.body.lastName;
    user.email = req.body.email;
    user.password = req.body.password;
    // user.gender = req.body.gender;
    user.save((err,docs)=> {
        if(!err)
        res.send(docs)
        else
        {
            if(err.code == 11000)
                res.status(422).send('[Duplicate email address found]')
                else 
                return next(err) 
        }
        // console.log(err)
    })
}


// module.exports.authenticate = (req,res,next) => {
//     console.log("authenticate")

//     password.authenticate('local',(err,user,info)=> {
//         if(err) return res.status(400).json(err)
//         else if(user) return res.status(200).json({"token": user.generateJwt()})
//         else return res.status(404).json(info)
//     })(req,res)
// }


module.exports.authenticate = (req, res, next) => {
    // call for passport authentication
    console.log(req.body);
    
    passport.authenticate('local', (err, user, info) => {
        console.log(err);
        console.log(info)
        console.log(user);
        
        // error from passport middleware
        if (err) return res.status(404).json(err);
        // registered user
        if (user) return res.status(200).json({ "token": user.generateJwt() });
        // unknown user or wrong password
        else return res.status(401).json(info);
    })(req, res);
}



module.exports.userProfile = (req,res,next) => {            
    User.findOne({ _id: req._id},
        (err,user) => {
            if(!user) 
                return res.status(404).json({status: false,  message: 'User record not found'})
            else 
                return res.status(200).json({status: true, user: _.pick(user,['fullName','lastName','email']) })
        })
}


module.exports.allUser = (req,res,next) => {
    User.find({},
        (err,user) =>{
            if(!user) 
            return res.status(404).json({status: false,  message: 'User record not found'})
        else 
            return res.status(200).json({status: true, user: user })
        })
}