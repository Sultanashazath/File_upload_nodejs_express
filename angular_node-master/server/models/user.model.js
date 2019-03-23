var mongooose = require('mongoose');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken')
var userSchema = new mongooose.Schema({
    fullName: {
        type: String,
        required: 'Full name can\'t be empty'
    },
    lastName: {
        type: String,
        required: 'Last name can\'t be empty'
    },
    email: {
        type: String,
        required: 'Email can\'t be empty',
        unique: true
    },
    password: {
        type: String,

        required: 'Password can\'t be empty',
        minlength : [4,'Password must be atleast 4 character long']
    },
    // gender:
    // {
    //     required: true,
    //     type: String
    // },
    
    role: {
		type: String,
	    enum:['admin','user'],
		required: true
		
	},
    saltSecret: String
})


userSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,13}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');

userSchema.pre('save', function (next) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(this.password, salt, (err, hash) => {
            this.password = hash;
            this.saltSecret = salt;
            next();
        });
    });
})


userSchema.methods.verifyPassword = function(password) {
    return bcrypt.compareSync(password,this.password)

}

userSchema.methods.generateJwt = function () {
    return jwt.sign({ _id: this._id},
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXP
        });
}



mongooose.model('User', userSchema);
