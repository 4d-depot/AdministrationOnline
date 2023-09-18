//%attributes = {"preemptive":"incapable"}
// this worker method runs in cooperative mode.
// it exposes non preemptive methods, so they can called from a preemptive web server.
// see https://doc.4d.com/4Dv17R4/4D/17-R4/New-signal.301-4104310.en.html

C_OBJECT($1)
C_TEXT($job)
C_BOOLEAN($statusReject)

$job:=String($1.description)

Case of 
	: ($job="GetSqlInfo")
		Use ($1)
			$1.sqlPort:=Get database parameter(SQL Server Port ID)
			$1.sqlCase:=Get database parameter(SQL engine case sensitivity)
		End use 
		$1.trigger()  // The work is finished
		
	: ($job="GetBackupInfo")
		C_DATE($date)
		C_TIME($time)
		Use ($1)
			GET BACKUP INFORMATION(Last backup date; $date; $time)
			$1.lastBackupDate:=Replace string(String($date; ISO date; $time); "T"; "&nbsp;&nbsp;")
			
			GET BACKUP INFORMATION(Next backup date; $date; $time)
			$1.nextBackupDate:=Replace string(String($date; ISO date; $time); "T"; "&nbsp;&nbsp;")
		End use 
		$1.trigger()  // The work is finished
		
	: ($job="SQL_START")
		START SQL SERVER
		Use ($1)
			$1.ok:=OK
		End use 
		$1.trigger()  // The work is finished
		
	: ($job="SQL_STOP")
		STOP SQL SERVER
		Use ($1)
			$1.ok:=OK
		End use 
		$1.trigger()  // The work is finished
		
	: ($job="SQL_RESTART")
		STOP SQL SERVER
		START SQL SERVER
		Use ($1)
			$1.ok:=OK
		End use 
		$1.trigger()  // The work is finished
		
	: ($job="WEB_RESTART")
		WEB STOP SERVER
		WEB START SERVER
		Use ($1)
			$1.ok:=OK
		End use 
		$1.trigger()  // The work is finished
		
	: ($job="VERIFY_DATA")
		VERIFY CURRENT DATA FILE(Verify all; Timestamp log file name; "")
		Use ($1)
			$1.ok:=OK
		End use 
		$1.trigger()  // The work is finished
		
	: ($job="BACKUP")
		BACKUP
		Use ($1)
			$1.ok:=OK
		End use 
		$1.trigger()  // The work is finished
		
	: ($job="TOGGLE_REJECT")
		$statusReject:=Get application info.newConnectionsAllowed
		REJECT NEW REMOTE CONNECTIONS($statusReject)
		Use ($1)
			$1.ok:=OK
		End use 
		$1.trigger()  // The work is finished
		
	: ($job="TOGGLE_REJECT_SOAP")
		$statusReject:=WEB Get server info.SOAPServerStarted
		SOAP REJECT NEW REQUESTS($statusReject)
		Use ($1)
			$1.ok:=OK
		End use 
		$1.trigger()  // The work is finished
		
		
		
		// non blocking calls, no response given, just execute them...
		// no signal needed
	: ($job="DROP")
		DROP REMOTE USER($1.sessionID)
		
	: ($job="MSG")
		SEND MESSAGE TO REMOTE USER($1.message; $1.sessionID)
		
	: ($job="abort")
		ABORT PROCESS BY ID($1.processID)
End case 

