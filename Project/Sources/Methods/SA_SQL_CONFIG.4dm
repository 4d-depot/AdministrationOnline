//%attributes = {"invisible":true,"preemptive":"capable"}
C_OBJECT($obResult; $signal)
C_TEXT($json)
C_BOOLEAN($signaled)

$obResult:=New object
$signal:=New signal("GetSqlInfo")
CALL WORKER("Util_Worker"; "Util_Worker"; $signal)  // runs cooperative
$signaled:=$signal.wait(2)  // wait 2 seconds
$obResult.port:=Num($signal.sqlPort)
$obResult.caseSensitivity:=Choose(Num($signal.sqlCase); "Disabled"; "Enabled")

$obResult.license:=SA_License_Info("SQL")
$obResult.license.used:=SA_SQL_Processes

$json:=JSON Stringify($obResult; *)
WEB SEND TEXT($json; "application/json")