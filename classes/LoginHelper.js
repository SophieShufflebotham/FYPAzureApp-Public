require('crypto');

function decodeBase64(base64String)
{
    var plaintextString = "";
    console.log(base64String);
    //var buffer = Buffer.alloc(base64String.length, base64String, 'base64');
    var buffer = new Buffer(base64String, 'base64');
    plaintextString = buffer.toString('utf-8');
    console.log(plaintextString)
    return plaintextString;
}

function encodeBase64(plaintextString)
{
    var base64String = "";
    //var buffer = Buffer.alloc(plaintextString.length, plaintextString, "utf-8");
    var buffer = new Buffer(plaintextString);

    base64String = buffer.toString('base64');
    return base64String;
}

function hashPassword(plainText)
{
    var hashedPassword = plainText;

    return hashedPassword;
}

function validateUsername(enteredUsername, correctUsername)
{
    var valid = false;

    console.log(enteredUsername);
    if(enteredUsername == correctUsername)
    {
        valid = true;
    }

    return valid;
}

function validatePassword(enteredPassword, correctPasswordHash)
{
    var enteredPasswordHash = "";
    var valid = false;

    enteredPasswordHash = hashPassword(enteredPassword);

    if(enteredPasswordHash == correctPasswordHash)
    {
        valid = true;
    }

    return valid;
}

function updatePassword(newPassword)
{

}

class LoginHelper
{
    constructor(username, base64password)
    {
        this.username = username;
        this.password = base64password;
    }

    validate(resultPromise)
    {
        var inputUsername = this.username;
        var inputPassword = decodeBase64(this.password);
        var response  = {};

        return resultPromise.then(function (result){
            var promise = new Promise(function (resolve, reject)
            {
                if (result.length > 0)
                {
                    var correctUsername = result[0].username;
                    var correctPassword = result[0].password;
                }
                else
                {
                    var correctUsername = "";
                    var correctPassword = "";
                }

                var valid = false;
                var response = null;


                valid = validateUsername(inputUsername, correctUsername);

                if(!valid)
                {
                    response = {"valid": false, "reason": "Incorrect Username"};
                }
                else
                {
                    valid = validatePassword(inputPassword, correctPassword);
                }

                if(!valid && !response)
                {
                    response = {"valid": false, "reason": "Incorrect Password"};
                }
                else if(valid)
                {
                    response = {"valid": true, "userId": result[0].id};
                }
                resolve(response);
            });
            return promise;
        });
    }
}

module.exports = LoginHelper;