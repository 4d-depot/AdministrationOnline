var dtIni = {
    order: [],
    dom: 'Bfrtip',
    searching: false,
    destroy: true,
    scrollX: true,
    buttons: [],
    scrollY: "400px",
    scrollCollapse: true,
    paging: false

};

var opersList = [];
var dtRTM;
var dt;

$(document).ready(function () {

    $("#rtm-link").addClass("active");
    listRTM();

    $("#btnPlay").click(function () {
        intervalID = setInterval(function () {
            dt.ajax.reload(null, false);
        }, 5000);
        $("#btnPlay").hide();
        $("#btnPause").show();
    });

    $("#btnPause").click(function () {
        clearInterval(intervalID);
        $("#btnPlay").show();
        $("#btnPause").hide();
    });
});

function listRTM() {

    url = "/admin/rtmInfo";


    dtRTM = dtIni;

    dtRTM.ajax = {
        "url": url,
        "type": "GET"
    };

//   COLUMNS DECLARATION
    dtRTM.columns = [
        {"data": "taskId", "title": "Process ID", "width": '5%'},
        {"data": "uuid", "title": "Process", "width": '10%'},
        {"data": "message", "title": "Information", "width": '40%'},
        {"data": "startTime", "title": "Start time", "width": '10%'},
        {"data": "duration", "title": "Duration (ms)", "width": '5%'}
    ];


    // CLICK ON A ROW

    dtRTM.createdRow = function (row, data, dataIndex) {
        if (data.dbContextInfo !== undefined) {
            rowData = data;
            rowData.task_id = data.dbContextInfo.task_id;
            opersList.push(rowData);
        }
        $(row).click(function (e) {
            operationDetail(data);
        });
    };

    dtRTM.columnDefs = [
        {
            "targets": 0,
            "createdCell": function (td, cellData, rowData, row, col) {
                if (cellData !== '' && rowData.dbContextInfo !== undefined) {
                    $(td).html(rowData.dbContextInfo.task_id);
                }
            }
        },
        {
            "targets": 1,
            "createdCell": function (td, cellData, rowData, row, col) {
                if (cellData !== '' && rowData.dbContextInfo !== undefined) {
                   $(td).html(rowData.dbContextInfo.task_name);
                }
            }
        }
    ];


//    CONVERT REGION tbRTM TO DATATABLE

    dt = $('#tbRTM').DataTable(dtRTM);

    $("#tbRTM tbody").on("click", "tr", function() {
        $(this).toggleClass("selected");
      });

    intervalID = setInterval(function () {
        dt.ajax.reload(null, false);
    }, 5000);

}

function operationDetail(data) {

    $('#remote-context').html(data.remote  ==  1 ? "Created on Client" : "Created on Server");
    $('#oper-type').html(data.dbOperationDetails.operationType);
    $('#oper-table').html(data.dbOperationDetails.table);
    $('#process-num').html(data.dbContextInfo.task_id);
    $('#process-name').html(data.dbContextInfo.task_name);
    $('#user-4d').html(data.dbContextInfo.user4d_id);
    $('#session-name').html(data.dbContextInfo.user_name);
    $('#machine-name').html(data.dbContextInfo.host_name);

}


