var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');

var User = mongoose.model('User');

// passport.use(
//     new localStrategy({usernameField: 'email'}),
//     (username,password, done)=> {
//         User.findOne({email: username},
//             (err, user) =>{
//                 if(err)
//                 return done(err);

//                 else if(!user)
//                 return done(null, false, {message: 'Email is not registered'})
                
//                 else if(!user.verifyPassword(password))
//                 return done(null,false,{message : 'Wrong password'})

//                 else 
//                 return done(null, user)
//             })
//     }
// )



 
passport.use(
    new localStrategy({ usernameField: 'email' },
        (username, password, done) => {
            User.findOne({ email: username },
                (err, user) => {
                    if (err)
                        return done(err);
                    // unknown user
                    else if (!user)
                        return done(null, false, { message: 'Email is not registered' });
                    // wrong password
                    else if (!user.verifyPassword(password))
                        return done(null, false, { message: 'Wrong password.' });
                    // authentication succeeded
                    else
                        return done(null, user);
                });
        })
);
