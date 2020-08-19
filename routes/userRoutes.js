'use strict';
var express = require('express');
var router = express.Router();

//TODO authentication
//Require controller module
var user_controller = require('../controllers/userController.js');

//Request path should follow /users

//Get list of all users
router.get('/allUsers', user_controller.user_list);

//Get individual user's permissions
router.post('/userPermissions', user_controller.user_permission_post);

router.post('/userAccessCode', user_controller.user_accessCode_post);

router.post('/userLogin', user_controller.user_login_post);

router.post('/removePermission', user_controller.remove_user_permissions);

router.post('/addPermission', user_controller.add_permissions);

module.exports = router;
