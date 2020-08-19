var conn = require('../models/dbConnModel');
var RequestBuilder = require('../classes/RequestBuilder');
var LoginHelper = require('../classes/LoginHelper');

//TODO close conn afterwards
exports.user_list = function () 
{
    var sqlString = "select users.id, users.forename, users.surname, permissions.locationId, locations.locationName from dbo.users left join dbo.permissions on users.id = permissions.userId left join dbo.locations on locations.Id = permissions.locationId";

    var req = new RequestBuilder(conn)
    req.setSql(sqlString);

    return req.execute();
};


exports.user_permissions = function (requestParameters) 
{
    var sqlString = "select userId, locationId, locationName from dbo.permissions inner join dbo.locations on dbo.permissions.locationId  = dbo.locations.id where dbo.permissions.userId =" + requestParameters.userId;

    var req = new RequestBuilder(conn);
    req.setSql(sqlString);

    return req.execute();
};

exports.user_access_code = function (requestParameters)
{
    var sqlString = "select accessCode from dbo.users where id =" + requestParameters.userId;

    var req = new RequestBuilder(conn);
    req.setSql(sqlString);

    return req.execute();
}

exports.user_login = function (requestParameters)
{
    var inputLogin = new LoginHelper(requestParameters.username, requestParameters.password);
    var sqlString = `select id, username, password from dbo.users where username = '${requestParameters.username}'`;

    var req = new RequestBuilder(conn);
    req.setSql(sqlString);

    var promise = inputLogin.validate(req.execute());

    return promise;
}

exports.remove_permissions = function (requestParameters)
{
    console.log(requestParameters);
    var userId = requestParameters.userId;
    var locationIds = requestParameters.locationId;
    var locationIdString = "";

    console.log(locationIds);

    if (locationIds.length > 1)
    {
        for (var i = 0; i < locationIds.length; i++)
        {
            if (i == 0) {
                locationIdString = locationIds[0];
            }
            else
            {
                locationIdString += "or locationId =" + locationIds[i];
            }
        }
    }
    else
    {
        locationIdString = locationIds[0];
    }

    var sqlString = `delete from dbo.permissions where userId= ${userId} and (locationId = ${locationIdString}) `;

    console.log("SqlString: " + sqlString);

    var req = new RequestBuilder(conn);
    req.setSql(sqlString);

    return req.execute();
}

exports.add_permissions = function (requestParameters) {
    var userId = requestParameters.userId;
    var locationIds = requestParameters.locationId;
    var parametersString = "";

   for (var i = 0; i < locationIds.length; i++)
   {
       parametersString += `(${userId}, ${locationIds[i]})`;

       if (i != (locationIds.length -1))
       {
           parametersString += ",";
       }
   }

    var sqlString = `insert into dbo.permissions (userId, locationId) values ${parametersString}`;
    console.log("sql: " + sqlString);
    var req = new RequestBuilder(conn);
    req.setSql(sqlString);

    return req.execute();
}