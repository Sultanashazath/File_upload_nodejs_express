var express = require('express');
var router = express.Router();

var jwtHelper = require('../config/jwtHelper')

var ctrlUser = require('../controllers/user.controller')

router.post('/register', ctrlUser.register);
router.post('/authenticate', ctrlUser.authenticate);
router.get('/userProfile', jwtHelper.verifyJwtToken, ctrlUser.userProfile)

router.get('/users',jwtHelper.adminAuthenticate,ctrlUser.allUser)


module.exports = router;