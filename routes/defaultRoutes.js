'use strict';
var express = require('express');
var router = express.Router();

//Require controller module
var default_controller = require('../controllers/defaultController');

//Get request for home page - default
router.get('/', default_controller.index);


module.exports = router;
