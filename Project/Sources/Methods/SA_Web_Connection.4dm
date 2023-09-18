//%attributes = {"shared":true,"preemptive":"capable"}
C_TEXT($1; $2; $3; $4; $5; $6)

Case of 
		
		// HANDLING OF PAGES URLS (LINKS ON SIDEBAR)
	: ($1="/admin/ini@")
		WEB SEND FILE("/adm/index.html")
		
	: ($1="/admin/users")
		WEB SEND FILE("/adm/users.html")
		
	: ($1="/admin/processes@")
		WEB SEND FILE("/adm/processes.html")
		
	: ($1="/admin/maintenance@")
		WEB SEND FILE("/adm/maintenance.html")
		
	: ($1="/admin/app-server@")
		WEB SEND FILE("/adm/app-server.html")
		
	: ($1="/admin/sql-server@")
		WEB SEND FILE("/adm/sql-server.html")
		
	: ($1="/admin/web-server@")
		WEB SEND FILE("/adm/web-server.html")
		
	: ($1="/admin/rtm")
		WEB SEND FILE("/adm/rtm.html")
		
		
		
		// HANDLING OF XHRs 
	: ($1="/admin/appInfo")
		SA_APP_CONFIG
		
	: ($1="/admin/systemInfo")
		SA_SYSTEM_INFO
		
	: ($1="/admin/usersInfo@")
		SA_PROCESS_INFO("USERS")
		
	: ($1="/admin/procInfo@")
		SA_PROCESS_INFO("PROC")
		
	: ($1="/admin/sqlInfo")
		SA_SQL_CONFIG
		
	: ($1="/admin/webInfo")
		SA_WEB_CONFIG
		
	: ($1="/admin/rtmInfo@")
		SA_RTM_INFO
		
	: ($1="/admin/maintInfo@")
		SA_MAINT_INFO
		
	: ($1="/admin/actionServer@")
		SA_SERVER_ACTIONS
		
		
	: ($1="/admin/dropUsers")
		SA_USERS_ACTION("DROP")
		
	: ($1="/admin/sendMessage")
		SA_USERS_ACTION("MSG")
		
	: ($1="/admin/abortProcess")
		SA_ABORT_PROCESS
		
		
		// SENDING OF LOG FILES
	: ($1="/logs/getFile@")
		SA_LOGS
		
End case 
