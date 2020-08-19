var Request = require('tedious').Request;

class RequestBuilder
{
    constructor(conn)
    {
        this.connection = conn;
        this.results = [];
    }

    setSql(sqlString)
    {
        this.sql = sqlString;
    }

    execute()
    {
        var sql = this.sql;
        var connection = this.connection;
        var results = this.results;

        var promise = new Promise( function (resolve, reject)
        {
            var req = new Request(sql, function (err, count)
            {
                if(err)
                {
                    console.log("error" + err);
                    reject(err);
                }
            });

            req.on('row', function (columns){
                var rowObj = {};
                columns.forEach(function(column) {
                    var colName = column.metadata.colName;
                    var colValue = column.value;
                    rowObj[colName] = colValue;
                });
                results.push(rowObj);
            });

            req.on('doneInProc', function (rowCount, more, rows)
            {
                resolve(results);
            });

            req.on('error', function (err){
                console.log("error " + err);
            });

            connection.execSql(req);
        });
        
        return promise;
    }
    
}


module.exports = RequestBuilder;