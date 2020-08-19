var conn = require('../models/dbConnModel');
var RequestBuilder = require('../classes/RequestBuilder');
var moment = require("moment");

exports.set_access_time = function (requestParameters) {
    console.log(requestParameters);
    var location = requestParameters.locationId;
    var user = requestParameters.userId;
    var date = moment().format("YYYYMMDD");
    var time = moment().format("HH:mm:ss");
    var isExit = false;

    var callback = lookupExistingAccessTimes(location, user);
     var retVal =   callback.then(function (result) {
         var executedPreviously = false;

         if (result.length == 1) //If there's only one result and it's not the one we're trying to update
         {
             if (result[0].primaryLocation == 1 && result[0].locationRef != location)
             {
                 console.log("remove response - not needed");
                 result = null;
             }
         }

        if (result == null || result == "")
        {
            //Single quote everything apart from numbers
            var sqlString = `insert into dbo.accessTimes (locationRef, userId, entryTime, date) values (${location}, ${user}, '${time}', '${date}')`;
        }
        else
        {

            if (result[0].locationRef != location) //If someone had entered a new location without exiting their last
            {
                for (var i = 0; i < result.length; i++) {
                    if (result[i].primaryLocation == 1) {
                        result.splice(i, 1);
                    }
                }

                console.log("updoot");
                var sqlString = `update dbo.accessTimes set exitTime = '${time}' where id = ${result[0].id}`;
                var req = new RequestBuilder(conn);
                req.setSql(sqlString);
                executedPreviously = true;

                req.execute().then(function () {
                    console.log(".then callback");
                    var sqlString = `insert into dbo.accessTimes (locationRef, userId, entryTime, date) values (${location}, ${user}, '${time}', '${date}')`;
                    var req = new RequestBuilder(conn);
                    req.setSql(sqlString);

                    req.execute();
                });
            }
            else
            {
                var sqlString = `update dbo.accessTimes set exitTime = '${time}' where id = ${result[0].id}`;
            }

        }

         if (!executedPreviously)
         {
             var req = new RequestBuilder(conn);
             req.setSql(sqlString);

             req.execute();
         }

    });

    return retVal;
};

 function lookupExistingAccessTimes(location, user)
 {
     console.log("lookup");
     if (location)
     {
         var sqlString = `select dbo.accessTimes.id, entryTime, exitTime, locationRef, dbo.locations.primaryLocation, date from dbo.accessTimes inner join dbo.locations on dbo.accessTimes.locationRef  = dbo.locations.id where userId = ${user} and entryTime is not null and exitTime is null`;
     }
     else
     {
         var sqlString = `select dbo.accessTimes.id, entryTime, exitTime, locationRef, date from dbo.accessTimes where userId = ${user} and locationRef = ${location} and entryTime is not null and exitTime is null`;
     }

     console.log(sqlString);

    var req = new RequestBuilder(conn);
    req.setSql(sqlString);
    return req.execute();
}

exports.find_all_unsafe_users = function(requestParameters)
{
    var sqlString = "select users.id, forename, surname, locations.locationName, locations.primaryLocation from dbo.users inner join dbo.accessTimes on dbo.users.id = dbo.accessTimes.userId inner join dbo.locations on dbo.accessTimes.locationRef = dbo.locations.Id where isSafe = 0 and exitTime is null"
    var req = new RequestBuilder(conn);
    req.setSql(sqlString);

    return req.execute();
}

exports.clear_all_safety = function()
{
    var sqlString = `update dbo.users set isSafe = 0`;

    var req = new RequestBuilder(conn);
    req.setSql(sqlString);

    return req.execute();
}

exports.mark_as_safe = function (requestParameters)
{
    var userId = requestParameters.userId;

    var sqlString = `update dbo.users set isSafe = 1 where id = ${userId}`;

    var req = new RequestBuilder(conn);
    req.setSql(sqlString);

    return req.execute();
}

exports.clock_in_times = function (requestParameters) {
    var sqlString = "select users.forename, users.surname, accessTimes.entryTime, accessTimes.exitTime, accessTimes.date from dbo.users inner join dbo.accessTimes on dbo.users.id = dbo.accessTimes.userId inner join dbo.locations on dbo.locations.Id = dbo.accessTimes.locationRef where locations.primaryLocation = 1"

    var req = new RequestBuilder(conn);
    req.setSql(sqlString);

    return req.execute();
}

exports.all_locations = function ()
{
    var sqlString = "select * from locations";

    var req = new RequestBuilder(conn);
    req.setSql(sqlString);

    return req.execute();
}

exports.set_clock_in_location = function (requestParameters)
{
    var locationId = requestParameters.locationId;
    var sqlString = `UPDATE [dbo].[locations] SET primaryLocation = (case when Id = ${locationId} then 1 else 0 end)`;

    var req = new RequestBuilder(conn);
    req.setSql(sqlString);

    return req.execute();
}