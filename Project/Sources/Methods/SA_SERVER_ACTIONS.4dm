//%attributes = {"invisible":true,"preemptive":"capable"}
C_TEXT($reponse)
C_OBJECT($obVars; $signal)
C_BOOLEAN($signaled)

$obVars:=UTIL_WEB_Get_Vars
OK:=1

$signal:=New signal($obVars.action)
CALL WORKER("Util_Worker"; "Util_Worker"; $signal)  // runs cooperative
If (($obVars.Action="VERIFY_DATA") | ($obVars.Action="BACKUP"))
	$signaled:=$signal.wait()  // wait endless
Else 
	$signaled:=$signal.wait(5)  // wait 5 seconds
End if 
OK:=Num($signal.ok)

$reponse:=Choose(OK=1; "ok"; "error")
WEB SEND TEXT($reponse)
