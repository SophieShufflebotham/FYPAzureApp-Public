var PERMISSION_ARRAY = [];
var PERMISSION_ARRAY_WITH_BUTTONS = [];
var PERMISSION_MAPPING = {};
var PERMISSIONS_TO_REMOVE = [];
var PERMISSIONS_TO_ADD = [];
var USER_PERMISSION_LIST = [];
var EDITED_USER_ID;

function populateTable()
{
    jQuery.ajax({
         type: "GET",
         url: GET_LOCATIONS,
        success: writePermissionMapping
    });

    $("#save-changes-button").on('click', submitInfo);
}

function goBack()
{
    window.location.href = "../../views/index.html";
}

function processResult(data)
{
    var permissionArray = createFormattedArray(data);
    var completeUsers = [];
    PERMISSION_ARRAY = permissionArray;

    console.log(data);
    for (var i = 0; i < data.length; i++) {
        var dataObject = data[i];
        if (!completeUsers.includes(dataObject.id))
        {
            var htmlString = "<tr><td><button onclick=editUserPermissions(" + JSON.stringify({id: dataObject.id, forename: dataObject.forename, surname: dataObject.surname}) + ") data-toggle=\"modal\"data-target=\"#myModal\"class=\"btn btn-outline-secondary\">Edit Permissions</button></td>"
            htmlString += "<td>" + dataObject.forename + "</td>";
            htmlString += "<td>" + dataObject.surname + "</td >";
            htmlString += "<td><ul>" + (permissionArray[dataObject.id]? permissionArray[dataObject.id].toString() : "No Permissions") + "</ul></td></tr>";
            $("#editUserTable tbody").append(htmlString);
            completeUsers.push(dataObject.id);
        }
    }
}

function createFormattedArray(data)
{
    var permissionArray = [];
    var locationIdArray = [];

    for (var i = 0; i < data.length; i++)
    {
        var index = data[i].id;

        if (data[i].locationId)
        {
            if (!permissionArray[index])
            {
                locationIdArray[index] = `${data[i].locationId.toString()}`;
                permissionArray[index] = "<li>" + data[i].locationName + "</li>";
                PERMISSION_ARRAY_WITH_BUTTONS[index] = "<div class=\"custom-control custom-checkbox\"><li><input type=\"checkbox\" class=\"custom-control-input\"id=\"check" + data[i].locationId + "\"><label class=\"custom-control-label\" for=\"check" + data[i].locationId + "\">" + data[i].locationName + "</label></li></div>";
            }
            else
            {
                locationIdArray[index] += "," + `${data[i].locationId.toString()}`;
                permissionArray[index] += "<li>" + data[i].locationName + "</li>";
                PERMISSION_ARRAY_WITH_BUTTONS[index] += "<div class=\"custom-control custom-checkbox\"><li><input type=\"checkbox\" class=\"custom-control-input\"id=\"check" + data[i].locationId + "\"><label class=\"custom-control-label\" for=\"check" + data[i].locationId + "\">" + data[i].locationName + "</label></li></div>";
            }
        }
    }

    for (var i = 0; i < permissionArray.length; i++)
    {
        if (permissionArray[i] != undefined)
        {
            USER_PERMISSION_LIST[i] = `"[${locationIdArray[i]}]"`;
        }
    }

    return permissionArray
}

function writePermissionMapping(data)
{
    jQuery.ajax({
        type: "GET",
        url: GET_ALL_USERS,
        success: processResult
    });

    PERMISSION_MAPPING = data;
}

function goBack()
{
    window.location.href = "../../views/index.html";
}

function editUserPermissions(dataObject)
{
    //Reset globals to prevent mismatched updates
    PERMISSIONS_TO_ADD = [];
    PERMISSIONS_TO_REMOVE = [];

    configureModalWindow(dataObject.forename, dataObject.surname);
    EDITED_USER_ID = dataObject.id;
    createModalListDisplay(dataObject.id);
}

function configureModalWindow(forename, surname)
{
    $("#modal-box-header").text("Edit Permissions for " + forename + " " + surname);
    $("#modal-remove-permission").off('click');
    $("#modal-remove-permission").click(removePermissions);

    $("#modal-add-permission").off('click');
    $("#modal-add-permission").click(addPermissions);
}

function createModalListDisplay(userId)
{
    $("#modal-permission-list").remove();
    $("#modal-box-body").prepend("<ul id=\"modal-permission-list\">" + (PERMISSION_ARRAY_WITH_BUTTONS[userId]? PERMISSION_ARRAY_WITH_BUTTONS[userId] : "No Current Permissions") + "</ul>");
}

function submitInfo()
{
    if (PERMISSIONS_TO_REMOVE.length > 0 && PERMISSIONS_TO_ADD.length > 0)
    {
        webRequestCombinedAddRemove();
    }

    if (PERMISSIONS_TO_REMOVE.length > 0 && PERMISSIONS_TO_ADD.length == 0)
    {
        webRequestRemovePermissions();
    }

    if (PERMISSIONS_TO_ADD.length > 0 && PERMISSIONS_TO_REMOVE.length == 0)
    {
        webRequestAddPermissions();
    }
}

function removePermissions()
{
    var boxes = document.getElementById("modal-permission-list").getElementsByTagName("input");
    var permissionsToRemove = [];
    var boxesLength = boxes.length;

    for (var i = 0; i < boxesLength; i++)
    {
        if (boxes[i].checked)
        {
            var elementId = boxes[i].id;
            var locationId = elementId.replace("check", "");
            permissionsToRemove.push(Number(locationId));
        }
    }
    for (var i = 0; i < permissionsToRemove.length; i++)
    {
        $("#check" + permissionsToRemove[i]).parent().parent().remove();
    }

    PERMISSIONS_TO_REMOVE = permissionsToRemove;

}

function addPermissions()
{
    var missingPermissions = [];
    var individualPermissions = [];
    var htmlString = "";
    var permissionAdded = false;

    if (USER_PERMISSION_LIST[EDITED_USER_ID])
    {
        individualPermissions = JSON.parse(USER_PERMISSION_LIST[EDITED_USER_ID]);
    }


    for (var i = 0; i < PERMISSION_MAPPING.length; i++)
    {
        if (individualPermissions.indexOf(PERMISSION_MAPPING[i].Id) == -1)
        {
            missingPermissions.push(PERMISSION_MAPPING[i].Id);
        }
    }

    htmlString = createAddPermissionChecklist(missingPermissions);
    console.log(htmlString);

    $("#permission-modal-box-header").text("Select Permissions to Add");
    $("#add-permission-modal-list").remove();
    $("#permission-modal-box-body").prepend(htmlString);
    console.log("map: " + PERMISSION_MAPPING);
}

function webRequestRemovePermissions()
{
    var ajaxData = { userId: EDITED_USER_ID, locationId: PERMISSIONS_TO_REMOVE };

        var ajaxSettings = {
            type: "POST",
            url: POST_REMOVE_PERMISSIONS,
            contentType: "application/json",
            data: JSON.stringify(ajaxData),
            success: function (){console.log("finished: " + PERMISSIONS_TO_REMOVE)}
    }

    console.log("data: " + JSON.stringify(ajaxSettings.data));

    jQuery.ajax(ajaxSettings).done(function () {
        alert("Save complete");
        location.reload();
    });
}

function createAddPermissionChecklist(validPermissions)
{
    var htmlString = "";

    htmlString += `<ul id="add-permission-modal-list">`
    for (var i = 0; i < validPermissions.length; i++)
    {
        var index = validPermissions[i];
        htmlString += `<div class="custom-control custom-checkbox"><li><input type="checkbox" class="custom-control-input" id="check${index}"><label class="custom-control-label" for="check${index}">${PERMISSION_MAPPING[(index-1)].locationName}</label></li></div>`
    }
    htmlString += "</ul>"
    return htmlString;
}

function webRequestAddPermissions()
{
    var ajaxData = { userId: EDITED_USER_ID, locationId: PERMISSIONS_TO_ADD };

    var ajaxSettings = {
        type: "POST",
        url: POST_ADD_PERMISSIONS,
        contentType: "application/json",
        data: JSON.stringify(ajaxData),
        success: function () { console.log("finished: " + PERMISSIONS_TO_ADD) }
    }

    console.log("data: " + JSON.stringify(ajaxSettings.data));

    jQuery.ajax(ajaxSettings).done(function () {
        alert("Save complete");
        location.reload();
    });
}

function addPermissionsDetermineChanges()
{
    console.log("handler");
    var boxes = document.getElementById("add-permission-modal-list").getElementsByTagName("input");
    var permissionToAdd = [];
    var htmlString = "";

    //Find ticked permissions
    for (var i = 0; i < boxes.length; i++)
    {
        if (boxes[i].checked)
        {
            var locationId = boxes[i].id;
            permissionToAdd.push(Number(locationId.replace("check", "")));
        }
    }

    PERMISSIONS_TO_ADD = permissionToAdd;
    //Add to previous modal window
    for (var i = 0; i < permissionToAdd.length; i++)
    {
        var index = permissionToAdd[i];
        htmlString += `<div class="custom-control custom-checkbox"><li><input type="checkbox" class="custom-control-input" id="check${index}" disabled><label class="custom-control-label" for="check${index}">${PERMISSION_MAPPING[(index - 1)].locationName} (To be added)</label></li></div>`;
    }

    $("#modal-permission-list").append(htmlString);
}

function webRequestCombinedAddRemove()
{
    var ajaxDataAdd = { userId: EDITED_USER_ID, locationId: PERMISSIONS_TO_ADD };
    var ajaxDataRemove = { userId: EDITED_USER_ID, locationId: PERMISSIONS_TO_REMOVE };

    var ajaxSettingsRemove = {
        type: "POST",
        url: POST_REMOVE_PERMISSIONS,
        contentType: "application/json",
        data: JSON.stringify(ajaxDataRemove),
        success: function (){
            alert("Save complete");
            location.reload();
        }
    }

    var ajaxSettingsAdd = {
        type: "POST",
        url: POST_ADD_PERMISSIONS,
        contentType: "application/json",
        data: JSON.stringify(ajaxDataAdd),
        success: function () {
            jQuery.ajax(ajaxSettingsRemove);
        }
    }

    jQuery.ajax(ajaxSettingsAdd);
}