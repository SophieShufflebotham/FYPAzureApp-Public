var user_model = require('../models/userModel.js');

function promiseRejectionHandler(err) {
    console.log("An promise rejection error occurred: " + err);
    console.log(err.stack);
}

/* Name: user_list
 * Purpose: Send list of all users in response
 * URL: /users/allUsers
 * Request Type: GET
 * */
exports.user_list =  function (req, res)
{
    user_model.user_list().then(function (result)
    {
        sendResponse(res, result);
    }).catch(promiseRejectionHandler);
};

/* Name: user_permission_post
 * Purpose: Send list of all users in response
 * URL: /users/userPermissions
 * Request Type: POST
 * Parameters: userId (int)
 * */
exports.user_permission_post = function (req, res)
{
    user_model.user_permissions(req.body).then(function (result)
    {
        sendResponse(res, result);
    }).catch(promiseRejectionHandler);

};

/* Name: user_accessCode_post
 * Purpose: Send list of all users in response
 * URL: /users/userAccessCode
 * Request Type: POST
 * Parameters: userId (int)
 * */
exports.user_accessCode_post = function (req, res)
{
    user_model.user_access_code(req.body).then(function (result)
    {
        sendResponse(res, result);
    }).catch(promiseRejectionHandler);
}

/* Name: user_accessCode_post
 * Purpose: Send list of all users in response
 * URL: /users/userAccessCode
 * Request Type: POST
 * Parameters: userId (int)
 * */
exports.user_login_post = function (req, res)
{
    user_model.user_login(req.body).then(function (result)
    {
        sendResponse(res, result);
    }).catch(promiseRejectionHandler);
}

exports.remove_user_permissions = function (req, res)
{
    user_model.remove_permissions(req.body).then(function (result) {
        sendResponse(res, result);
    }).catch(promiseRejectionHandler)
}

exports.add_permissions = function (req, res) {
    user_model.add_permissions(req.body).then(function (result) {
        sendResponse(res, result);
    }).catch(promiseRejectionHandler);
};


function sendResponse(res, content)
{
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify(content));
}

