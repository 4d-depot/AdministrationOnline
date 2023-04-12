var dtIni = {
  order: [],
  dom: "Bfrtip",
  searching: false,
  destroy: true,
  scrollX: true,
  buttons: [],
  scrollY: "300px",
  scrollCollapse: true,
  paging: false,
  ajax: {
    url: "/admin/usersInfo",
    type: "GET"
  },
  drawCallback: function(settings) {
    var api = this.api();
    restoreSelection.call(api);
    updateButtons.call(api);
  }
};

var selectedSessionIDs = [];

$(document).ready(function() {
  $("#users-link").addClass("active");
  listUsers();
  setInterval(function() {
    dt.ajax.reload();
  }, 15000);

  // DROP USERS BUTTON
  $("#btnDropUsers").click(function() {
    url = "/admin/dropUsers";
    sessionIDs = getSessions(dt);
    json = JSON.stringify({ sessionIDs: sessionIDs });
    if (sessionIDs.length > 0) {
      $.post(url, json, function(data) {
        setInterval(function() {
          dt.ajax.reload();
        }, 1200);
        $("#tbUsers tbody").on("click", "tr", function() {
          $(this).toggleClass("selected");
        });
      });
    }
  });

  // SEND MESSAGE BUTTON
  $("#btnSendMessage").click(function() {
    sessionIDs = getSessions(dt);

    if (sessionIDs.length > 0) {
      var msg = prompt("Please enter your message");
      if (msg != null) {
        json = JSON.stringify({ sessionIDs: sessionIDs, message: msg });
        url = "/admin/sendMessage";

        $.post(url, json, function(data) {
          setInterval(function() {
            dt.ajax.reload();
          }, 1200);
          $("#tbUsers tbody").on("click", "tr", function() {
            $(this).toggleClass("selected");
          });
        });
      }
    }
  });
});

function listUsers() {
  dtUsers = dtIni;

  //   COLUMNS DECLARATION
  dtUsers.columns = [
    { data: "hostType", title: "O.S.", width: "2%" },
    { data: "type", title: "Type", width: "5%" },
    { data: "userName", title: "User Name", width: "15%" },
    { data: "machineName", title: "Machine", width: "15%" },
    { data: "systemUserName", title: "4D User", width: "15%" },
    { data: "IPAddress", title: "IP Address", width: "10%" },
    { data: "creationDateTime", title: "Login date", width: "15%" }
  ];

  dtUsers.columnDefs = [
    {
      targets: 0,
      className: "dt-right",
      createdCell: function(td, cellData, rowData, row, col) {
        if (cellData === "mac") {
          $(td).html('<li class="fab fa-apple"></li>');
        } else {
          $(td).html('<li class="fab fa-windows"></li>');
        }
      }
    },
    {
      targets: 6,
      createdCell: function(td, cellData, rowData, row, col) {
        cellDate = new Date();
        cellDate.setTime(Date.parse(cellData));
        $(td).html(cellDate);
      }
    }
  ];

  //    CONVERT REGION tbUsers TO DATATABLE
  dt = $("#tbUsers").DataTable(dtUsers);

  $("#tbUsers tbody").on("click", "tr", function() {
    $(this).toggleClass("selected");
    updateButtons.call(dt);
  });
}

function getSessions(dt) {
  dataRows = dt
    .rows(".selected")
    .data()
    .map(a => a.ID);
  var sessionIDs = [];

  for (i = 0; i < dataRows.length; i++) {
    sessionIDs.push(dataRows[i]);
  }
  return sessionIDs;
}

function updateButtons() {
  selectedSessionIDs = getSessions(this);

  var $btnDropUsers = $("#btnDropUsers");
  var $btnSendMessage = $("#btnSendMessage");

  if (selectedSessionIDs.length == 0) {
    $btnDropUsers.removeClass("btn-danger").addClass("btn-default");
    $btnSendMessage.removeClass("btn-primary").addClass("btn-default");
    $btnDropUsers.prop("disabled", true);
    $btnSendMessage.prop("disabled", true);
  } else {
    $btnDropUsers.removeClass("btn-default").addClass("btn-danger");
    $btnSendMessage.removeClass("btn-default").addClass("btn-primary");
    $btnDropUsers.prop("disabled", false);
    $btnSendMessage.prop("disabled", false);
  }
}

function restoreSelection() {
  var that = this;
  that.rows().every(function(rowIdx, tableLoop, rowLoop) {
    if (selectedSessionIDs.indexOf(this.data().ID) != -1) {
      $(this.node()).addClass("selected");
    }
  });
}
