function goBack()
{
    window.location.href = "../../views/index.html";
}

function populateTable()
{
    jQuery.ajax({
        type: "GET",
        url: GET_LOCATIONS,
        success: createListOfLocations
    });
}

function createListOfLocations(data)
{
    var isPrimary = "";
    var htmlString = "";
    var buttonString = "";
    var emergencyString = "";
    var errorMessage = "This location is already the designated clock in location!";


    for (var i = 0; i < data.length; i++)
    {
        emergencyString = (data[i].emergencyPoint ? data[i].emergencyPoint : "N/A");

        if (data[i].primaryLocation == 1)
        {
            isPrimary = "Current Clock In Location";
            buttonString = `<td><button class="btn btn-secondary"style="pointer-events: none;" disabled>Set as Clock In Location</button></td><td>`
        }
        else
        {
            isPrimary = "";
            buttonString = `<td><button onclick="verifyClockInChange(this.id)" id="button${data[i].Id}"class="btn btn-secondary">Set as Clock In Location</button></td><td>`
        }
        htmlString = `<tr>${buttonString}${data[i].locationName}</td><td>${emergencyString}</td><td> ${isPrimary}</td></tr>`
        $("#locationTable tbody").append(htmlString);
    }

}

function verifyClockInChange(id)
{
    var res = confirm("Are you sure? This will overwrite the previous Clock In Location!");
    var locationId = id.replace("button", "");

    if (res)
    {
        jQuery.ajax({
            type: "POST",
            url: POST_SET_LOCATION_PRIMARY,
            success: locationUpdated,
            data: {locationId: locationId}
        });
    }
}


function locationUpdated()
{
    alert("Save complete");
    window.location.reload();
}