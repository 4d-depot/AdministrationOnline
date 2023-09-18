$(document).ready(function () {

    loadInfo();
    setInterval(loadInfo, 30000);

    $("#btnRestartWeb").click(function () {
        url = "/admin/actionServer?action=WEB_RESTART";
        iniHtml = $(this).html();
        $(this).html("<i class='fa fa-spinner fa-spin '></i> Restarting");
        $(this).prop('disabled', true);
        $.get(url, function () {
            $("#btnRestartWeb").html(iniHtml);
            $("#btnRestartWeb").prop('disabled', false);
            loadInfo();
        });
    });

    $("#btnVerify").click(function () {
        url = "/admin/actionServer?action=VERIFY_DATA";
        iniHtml = $(this).html();
        $(this).html("<i class='fa fa-spinner fa-spin '></i> Verifying");
        $(this).prop('disabled', true);
        $.get(url, function () {
            $("#btnVerify").html(iniHtml);
            $("#btnVerify").prop('disabled', false);
            loadInfo();
        });
    });

    $("#btnBackup").click(function () {
        url = "/admin/actionServer?action=BACKUP";
        iniHtml = $(this).html();
        $(this).html("<i class='fa fa-spinner fa-spin '></i> Backup in progress");
        $(this).prop('disabled', true);
        $.get(url, function () {
            $("#btnBackup").prop('disabled', false);
            $("#btnBackup").html(iniHtml);
            loadInfo();
        });
    });

    

    $("[id^=btnSQL]").click(function () {
        action = $(this).attr("id").substring(3);
        url = "/admin/actionServer?action=" + action;
        iniHtml = $(this).html();

        if (action == "SQL_Restart") {
            $(this).html("<i class='fa fa-spinner fa-spin '></i> Restarting");
        }
        $("[id^=btnSQL]").prop('disabled', true);

        $.get(url, function () {
            $("#btn" + action).html(iniHtml);
            $("[id^=btnSQL]").prop('disabled', false);
            loadInfo();
        });
    });



    $("#btnToggleReject").click(function () {
       
        url = "/admin/actionServer?action=TOGGLE_REJECT";
        
        $.get(url, function () {
           
            loadInfo();
        });
    });

    $("#btnSOAPToggleReject").click(function () {
       
        url = "/admin/actionServer?action=TOGGLE_REJECT_SOAP";
        
        $.get(url, function () {
           
            loadInfo();
        });
    });

});


function loadInfo() {


    switch (location.pathname) {
        case '/admin/maintenance':
            $("#maint-link").addClass("active");
            getMaintInfo();
            break;
        case '/admin/app-server':
            $("#app-link").addClass("active");
            getSystemInfo();
            getAppInfo();
            break;
        case '/admin/sql-server':
            $("#sql-link").addClass("active");
            getSystemInfo();
            getSqlInfo();
            break;

        case '/admin/web-server':
            $("#web-link").addClass("active");
            getWebInfo();
            break;

        default:
            $("#ini-link").addClass("active");
            getSystemInfo();
            break;
    }
}

function getSystemInfo() {

    url = "/admin/systemInfo";

    $.getJSON(url, function (data) {
        $("#system-info").html(data.osVersion);
        $("#machine-info").html(data.machine);
        $("#ip-info").html(data.ipAddresses);
        $("#processor-info").html(data.processor);
        $("#processor-detail").html("<b>Cores:</b> " + data.cores + "&nbsp;&nbsp;&nbsp;<b>Threads:</b> " + data.threads);
        $("#app-info").html(data.app);
        $("#license-info").html(data.licenses.licenseName);
        $("#licensee-info").html(data.licenses.licensee);
        if (data.osVersion.match(/Windows.*/)) {
            $("#os-icon").addClass("fab fa-windows");
        } else {
            $("#os-icon").addClass("fab fa-apple");
        }

        if (data.licenses.prod.usedCount !== undefined) {
            usersCount = data.licenses.prod.usedCount;
        } else {
            usersCount = 0;
        }

        usedCache = Math.round(data.usedCache / Math.pow(1024, 2));
        totalCache = Math.round(data.maxCache / Math.pow(1024, 2));

        $("#num-users").html(usersCount + " / " + data.licenses.prod.allowedCount);
        $("#users-bar").width(100 * usersCount / data.licenses.prod.allowedCount + "%");
        $("#cache-mem").html(usedCache + " / " + totalCache);
        $("#cache-bar").width(100 * usedCache / totalCache + "%");

        if (location.pathname === "/admin/ini") {
            chartMemory(data.memory);
            chartDrive(data.drive);
        }
        if (location.pathname === "/admin/app-server") {

        }
    });
}

function getAppInfo() {
    
    url = "/admin/appInfo";
    
    $.getJSON(url, function (data) {
        $("#struct-file").html(data.structFile);
        $("#data-file").html(data.dataFile);
        $("#log-file").html(data.logFile);
        $("#exec-mode").html(data.execMode);
        $("#port-info").html(data.app.portID);
        
        iniDate = new Date(Date.now() - (1000 * data.app.uptime));
        $("#server-status").html((data.app.uptime > 0) ? "Started" : "Stopped");
        $("#server-uptime").html(Math.round(data.app.uptime / 3600));
        $("#server-ini-date").html(iniDate.toString().substr(0, 31));
        
        if(data.app.newConnectionsAllowed) {
            $("#btnToggleReject").addClass("btn-danger");
            $("#btnToggleReject").removeClass("btn-success");
            $("#btnToggleReject").html('<i class="fa fa-stop" aria-hidden="true">&nbsp;</i> Reject new connections');
        } else {
            $("#btnToggleReject").addClass("btn-success");
            $("#btnToggleReject").removeClass("btn-danger");
            $("#btnToggleReject").html('<i class="fa fa-play" aria-hidden="true">&nbsp;</i> Accept new connections');

        }
    });
}


function getMaintInfo() {

    url = "/admin/maintInfo";

    $.getJSON(url, function (data) {

        if (data.repairDate == "") {
            $("#a-report-repair").hide();
            $("#last-repair").html("Unknown");
        } else {
            $("#last-repair").html(data.repairDate);

        }

        if (data.verifDate == "") {
            $("#a-report-verif").hide();
            $("#last-verif").html("Unknown");
        } else {
            $("#last-verif").html(data.verifDate);

        }

        if (data.compactDate == "") {
            $("#a-report-compact").hide();
            $("#last-compact").html("Unknown");
        } else {
            $("#last-compact").html(data.compactDate);

        }

        $("#server-uptime").html(Math.round(data.uptime / 3600));
        $("#last-backup").html(data.lastBackupDate);
        $("#next-backup").html(data.nextBackupDate);
        $("#available-space").html(data.driveFree + " GB");
    });
}
function getSqlInfo() {

    url = "/admin/sqlInfo";

    $.getJSON(url, function (data) {
        $("#sql-users").html(data.license.used + " / " + data.license.maxConns);
        $("#sql-bar").width(100 * data.license.used / data.license.maxConns + "%");
        $("#case-info").html(data.caseSensitivity);
        $("#port-info").html(data.port);
    });
}

function getWebInfo() {

    url = "/admin/webInfo";

    $.getJSON(url, function (data) {

        iniDate = new Date(Date.now() - (1000 * data.uptime));
        $("#http-ini-date").html(iniDate.toString().substr(0, 31));
        $("#http-status").html(data.started ? "Started" : "Stopped");
        $("#http-uptime").html(Math.round(data.uptime / 3600));
        $("#http-rqt").html(data.httpRequestCount);

        $("#soap-on").html(data.SOAPServerStarted ? "Accepted" : "Rejected");
//        $("#auto-launch").html(data.options.webPortID);
        $("#auto-launch").html(data.startMode);
//        $("#http-proc").html(data.options.webPortID);
//        $("#cache-mem").html(data.options.webPortID);

        $("#ip-info").html(data.options.webIPAddressToListen.join());
        $("#http-port").html(data.options.webPortID);
        $("#tls-on").html(data.security.HTTPSEnabled ? "yes" : "no");
        $("#https-port").html(data.options.webHTTPSPortID);
//        $("#log-file").html(data.log);
//        $("#log-format").html(data.options.webPortID);
//        $("#next-bk").html(data.options.webPortID);

        if(data.SOAPServerStarted) {
            $("#btnSOAPToggleReject").addClass("btn-danger");
            $("#btnSOAPToggleReject").removeClass("btn-success");
            $("#btnSOAPToggleReject").html('<i class="fa fa-stop" aria-hidden="true">&nbsp;</i> Reject new SOAP requests');
        } else {
            $("#btnSOAPToggleReject").addClass("btn-success");
            $("#btnSOAPToggleReject").removeClass("btn-danger");
            $("#btnSOAPToggleReject").html('<i class="fa fa-play" aria-hidden="true">&nbsp;</i> Accept new SOAP requests');

        }





    });
}

function chartMemory(data) {

    var colors = palette('sequential', data.memLabels.length, 0).map(function (hex) {
        return '#' + hex;
    });

    var dataGraf = {
        labels: data.memLabels,
        datasets: [
            {
                label: "Memory information",
                data: data.memData,
                backgroundColor: colors,
                borderColor: colors
            }]
    };

    ctx2 = $("#mem-chart");
    $("#mem-size").html(data.Physical_Memory_Size + " GB");

    var myPieChart = new Chart(ctx2, {
        type: 'doughnut',
        data: dataGraf,
        options: {
            legend: {display: true, position: 'bottom', fullWidth: false},
            cutoutPercentage: 40,
            animation: {
                duration: 0
            }
        }
    });



}

function chartDrive(data) {

    var colors = palette('sequential', data.driveLabels.length, 0).map(function (hex) {
        return '#' + hex;
    });

    var dataGraf = {
        labels: data.driveLabels,
        datasets: [
            {
                label: "Drive information",
                data: data.driveData,
                backgroundColor: colors,
                borderColor: colors
            }]
    };

    ctx2 = $("#drive-chart");

    $("#drive-size").html(data.driveSize + " GB");

    var myPieChart = new Chart(ctx2, {
        type: 'doughnut',
        data: dataGraf,
        options: {
            legend: {display: true, position: 'bottom', fullWidth: false},
            cutoutPercentage: 40,
            animation: {
                duration: 0
            }
        }
    });

}

