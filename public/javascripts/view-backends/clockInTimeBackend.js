
function populateTable()
{
    jQuery.ajax({
        type: "GET",
        url: GET_CLOCK_IN,
        success: processResult
    });
}

function goBack()
{
    window.location.href = "../../views/index.html";
}

function processResult(data)
{
    for (var i = 0; i < data.length; i++) {
        var dataObject = data[i];
        var entryTime = new Date(dataObject.entryTime);
        var exitTime = (dataObject.exitTime ? new Date(dataObject.exitTime) : null);

        var date = new Date(dataObject.date);
        var htmlString = "<tr><td>" + date.toLocaleDateString('en-GB') + "</td>"
        htmlString += "<td>" + dataObject.forename + "</td>";
        htmlString += "<td>" + dataObject.surname + "</td >";
        htmlString += "<td>" + entryTime.toLocaleTimeString() + "</td>";
        htmlString += "<td>" + (exitTime ? exitTime.toLocaleTimeString() : "N/A") + "</td></tr>";
        $("#clockInTable tbody").append(htmlString);
    }
}