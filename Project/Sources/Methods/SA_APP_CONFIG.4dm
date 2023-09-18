//%attributes = {"invisible":true}
C_OBJECT($obResult)
C_TEXT($json)
$obResult:=New object

$obResult.structFile:=Structure file(*)
$obResult.dataFile:=Data file
$obResult.logFile:=Log file
$obResult.execMode:=Choose(Is compiled mode(*); "Compiled"; "Interpreted")
$obResult.app:=Get application info

$json:=JSON Stringify($obResult; *)
WEB SEND TEXT($json; "application/json")