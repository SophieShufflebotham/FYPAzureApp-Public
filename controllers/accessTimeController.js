var access_model = require('../models/accessTimeModel');

function promiseRejectionHandler(err) {
    console.log("An promise rejection error occurred: " + err);
    console.log(err.stack);
}

/* Name: set_accessTime_post
 * Purpose: Set access time
 * URL: /users/allUsers
 * Request Type: POST
 * */
exports.set_accessTime_post = function (req, res) {
    access_model.set_access_time(req.body).then(function (result) {
        sendResponse(res, result);
    }).catch(promiseRejectionHandler);
};

exports.find_all_unsafe_users_get = function (req, res) {
    access_model.find_all_unsafe_users(req.body).then(function (result) {
        sendResponse(res, result);
    }).catch(promiseRejectionHandler);
};

exports.mark_as_safe_post = function (req, res) {
    access_model.mark_as_safe(req.body).then(function (result) {
        sendResponse(res, result);
    }).catch(promiseRejectionHandler);
};

exports.clear_all_safety_get = function (req, res) {
    access_model.clear_all_safety().then(function (result) {
        sendResponse(res, result);
    }).catch(promiseRejectionHandler);
};

exports.clock_in_time_get = function (req, res) {
    access_model.clock_in_times().then(function (result) {
        sendResponse(res, result);
    }).catch(promiseRejectionHandler);
};

exports.all_locations = function (req, res) {
    access_model.all_locations().then(function (result) {
        sendResponse(res, result);
    }).catch(promiseRejectionHandler);
};

exports.set_clock_in_location = function (req, res) {
    access_model.set_clock_in_location(req.body).then(function (result) {
        sendResponse(res, result);
    }).catch(promiseRejectionHandler);
}

function sendResponse(res, content) {
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify(content));
}

