//%attributes = {"invisible":true,"preemptive":"capable"}
C_TEXT($1; $response)
C_OBJECT($obBody)
C_TEXT($body; $sessionID)
WEB GET HTTP BODY($body)
$obBody:=JSON Parse($body)



Case of 
	: ($1="DROP")
		For each ($sessionID; $obBody.sessionIDs)
			CALL WORKER("Util_Worker"; "Util_Worker"; New object("description"; "DROP"; "sessionID"; $sessionID))  // runs cooperative
		End for each 
		$response:="users have been dropped"
		
	: ($1="MSG")
		For each ($sessionID; $obBody.sessionIDs)
			CALL WORKER("Util_Worker"; "Util_Worker"; New object("description"; "MSG"; "sessionID"; $sessionID; "message"; $obBody.message))  // runs cooperative
			//SEND MESSAGE TO REMOTE USER($message;$sessionID)  ??
		End for each 
		$response:="messages sent"
		
End case 

WEB SEND TEXT($response)