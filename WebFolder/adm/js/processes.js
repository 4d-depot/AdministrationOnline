var dtIni = {
  order: [],
  dom: "Bfrtip",
  searching: true,
  destroy: true,
  scrollX: true,
  buttons: [],
  scrollY: "300px",
  scrollCollapse: true,
  paging: false,
  ajax: {
    url: "/admin/procInfo",
    type: "GET"
  },
  drawCallback: function(settings) {
    var api = this.api();
    restoreSelection.call(api);
    updateButtons.call(api);
  }
};

var processTypes = [];
var processStates = [];
var selectedProcessIDs = [];

$(document).ready(function() {
  $("#processes-link").addClass("active");
  setProcessTypes();
  setProcessStates();
  listProcesses();
  setInterval(function() {
    dt.ajax.reload();
  }, 15000);

  // ABORT PROCESS BUTTON
  $("#btnAbort").click(function() {
    url = "/admin/abortProcess";
    processIDs = getProcessIDs(dt);
    json = JSON.stringify({ processIDs: processIDs });
    if (processIDs.length > 0) {
      $.post(url, json, function(data) {
        setInterval(function() {
          dt.ajax.reload();
        }, 1200);

        $("#tbProcesses tbody").on("click", "tr", function() {
          $(this).toggleClass("selected");
        });
      });
    }
  });
});

function listProcesses(q) {
  dtProcs = dtIni;

  //   COLUMNS DECLARATION
  dtProcs.columns = [
    //        {"data": "hostType", "title": "O.S.", "width": '2%'},
    { data: "name", title: "Process name", width: "20%" },
    { data: "sessionID", title: "Session", width: "10%" },
    { data: "type", title: "Type", width: "20%" },
    { data: "ID", title: "Num", width: "2%" },
    { data: "state", title: "State", width: "15%" },
    {
      data: "cpuTime",
      title: "CPU Time (s)",
      width: "6%",
      render: $.fn.dataTable.render.number(",", ".", 0, "")
    },
    {
      data: "cpuUsage",
      title: "Activity",
      width: "5%",
      render: $.fn.dataTable.render.number(",", ".", 3, "")
    }
  ];

  dtProcs.columnDefs = [
    {
      targets: 1,
      createdCell: function(td, cellData, rowData, row, col) {
        if (cellData !== "") {
          $(td).html(rowData.session.systemUserName);
        }
      }
    },
    {
      targets: 2,
      createdCell: function(td, cellData, rowData, row, col) {
        if (cellData !== "") {
          $(td).html(processTypes[cellData]);
        }
      }
    },
    {
      targets: 4,
      createdCell: function(td, cellData, rowData, row, col) {
        if (cellData !== "") {
          $(td).html(processStates[cellData]);
        }
      }
    },
    {
      targets: 6,
      type: "num-fmt"
    }
  ];

  dtProcs.createdCell = function(td, cellData, rowData, row, col) {};

  //    CONVERT REGION tbUsers TO DATATABLE
  dt = $("#tbProcesses").DataTable(dtProcs);

  $("#tbProcesses tbody").on("click", "tr", function() {
    $(this).toggleClass("selected");
    updateButtons.call(dt);
  });
}

function setProcessTypes() {
  processTypes[-58] = "HTTP Log flusher";
  processTypes[-57] = "Logger process";
  processTypes[-56] = "HTTP Listener";
  processTypes[-55] = "HTTP Worker pool server";
  processTypes[-54] = "SQL Listener";
  processTypes[-53] = "SQL Net Session manager";
  processTypes[-52] = "SQL Worker pool server";
  processTypes[-51] = "DB4D Listener";
  processTypes[-50] = "DB4D Mirror";
  processTypes[-49] = "DB4D Cron";
  processTypes[-48] = "DB4D Worker pool user";
  processTypes[-47] = "DB4D Garbage collector";
  processTypes[-46] = "DB4D Flush cache";
  processTypes[-45] = "DB4D Index builder";
  processTypes[-44] = "ServerNet Session manager";
  processTypes[-43] = "ServerNet Listener";
  processTypes[-42] = "Worker pool spare";
  processTypes[-41] = "Worker pool in use";
  processTypes[-40] = "Other internal process";
  processTypes[-39] = "Main 4D process";
  processTypes[-31] = "Client manager process";
  processTypes[-26] = "Monitor process";
  processTypes[-25] = "Internal timer process";
  processTypes[-24] = "SQL Method execution process";
  processTypes[-22] = "MSC process";
  processTypes[-21] = "Restore Process";
  processTypes[-20] = "Log file process";
  processTypes[-19] = "Backup process";
  processTypes[-18] = "Internal 4D server process";
  processTypes[-17] = "Method editor macro process";
  processTypes[-16] = "On exit process";
  processTypes[-15] = "Server interface process";
  processTypes[-14] = "Execute on client process";
  processTypes[-13] = "Web server process";
  processTypes[-12] = "Web process on 4D remote";
  processTypes[-10] = "Other 4D process";
  processTypes[-9] = "External task";
  processTypes[-8] = "Event manager";
  processTypes[-7] = "Apple event manager";
  processTypes[-6] = "Serial Port Manager";
  processTypes[-5] = "Indexing process";
  processTypes[-4] = "Cache manager";
  processTypes[-3] = "Web process with no context";
  processTypes[-2] = "Design process";
  processTypes[-1] = "Main process";
  processTypes[0] = "None";
  processTypes[1] = "Execute on server process";
  processTypes[2] = "Created from menu command";
  processTypes[3] = "Created from execution dialog";
  processTypes[4] = "Other user process";
  processTypes[5] = "Worker process";
}

function setProcessStates() {
  processStates[-1] = "Aborted";
  processStates[1] = "Delayed";
  processStates[-100] = "Does not exist";
  processStates[0] = "Running";
  processStates[6] = "Hidden modal dialog";
  processStates[5] = "Paused";
  processStates[3] = "Waiting for input output";
  processStates[4] = "Waiting for internal flag";
  processStates[2] = "Waiting for user event";
}

function getProcessIDs(dt) {
  dataRows = dt
    .rows(".selected")
    .data()
    .map(a => a.ID);
  var processIDs = [];

  for (i = 0; i < dataRows.length; i++) {
    if (dataRows[i] !== 0) {
      processIDs.push(dataRows[i]);
    }
  }
  return processIDs;
}

function updateButtons() {
  selectedProcessIDs = getProcessIDs(this);

  var $btnAbortProcess = $("#btnAbort");

  if (selectedProcessIDs.length == 0) {
    $btnAbortProcess.removeClass("btn-danger").addClass("btn-default");
    $btnAbortProcess.prop("disabled", true);
  } else {
    $btnAbortProcess.removeClass("btn-default").addClass("btn-danger");
    $btnAbortProcess.prop("disabled", false);
  }
}

function restoreSelection() {
  var that = this;
  that.rows().every(function(rowIdx, tableLoop, rowLoop) {
    if (selectedProcessIDs.indexOf(this.data().ID) != -1) {
      $(this.node()).addClass("selected");
    }
  });
}
