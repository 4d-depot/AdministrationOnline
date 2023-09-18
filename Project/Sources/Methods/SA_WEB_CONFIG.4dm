//%attributes = {"invisible":true}
//SA_WEB_CONFIG
C_OBJECT($obWeb)
C_TEXT($json)
$obWeb:=WEB Get server info
$json:=JSON Stringify($obWeb; *)
WEB SEND TEXT($json; "application/json")