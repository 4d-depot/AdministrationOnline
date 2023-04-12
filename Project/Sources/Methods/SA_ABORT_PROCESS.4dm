//%attributes = {"invisible":true}
C_TEXT($1; $response)
C_OBJECT($obBody)
C_TEXT($body)
C_LONGINT($processID)
WEB GET HTTP BODY($body)
$obBody:=JSON Parse($body)

For each ($processID; $obBody.processIDs)
	CALL WORKER("Util_Worker"; "Util_Worker"; New object("description"; "abort"; "processID"; $processID))  // runs cooperative
End for each 

$response:="Process(es) aborted"

WEB SEND TEXT($response)