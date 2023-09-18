//%attributes = {"invisible":true}
C_OBJECT($obRTM)
ARRAY OBJECT($aoActivities; 0)
ARRAY TEXT($atStart; 0)
ARRAY LONGINT($alDuration; 0)
ARRAY OBJECT($aoDetails; 0)
C_TEXT($json; $ip)
C_LONGINT($total)

GET ACTIVITY SNAPSHOT($aoActivities; *)  //;$atStart;$alDuration;$aoDetails;*)

$obRTM:=New object
OB SET ARRAY($obRTM; "data"; $aoActivities)

$obRTM.draw:=1
$total:=Size of array($aoActivities)
$obRTM.recordsTotal:=$total
$obRTM.recordsFiltered:=$total

$json:=JSON Stringify($obRTM; *)
WEB SEND TEXT($json; "application/json")