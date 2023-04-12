//%attributes = {"invisible":true}
C_OBJECT($obResult; $obActivity)
C_LONGINT($total; $filtered)
C_TEXT($json; $1)


$obActivity:=Get process activity

$obResult:=New object

If ($1="USERS")
	$obResult.data:=$obActivity.sessions
	$total:=$obActivity.sessions.length
Else 
	$obResult.data:=$obActivity.processes
	$total:=$obActivity.processes.length
	
End if 

$filtered:=$total

$obResult.draw:=1
$obResult.recordsTotal:=$total
$obResult.recordsFiltered:=$filtered
$obResult.activity:=$obActivity
$json:=JSON Stringify($obResult; *)
WEB SEND TEXT($json; "application/json")