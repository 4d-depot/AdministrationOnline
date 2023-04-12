//%attributes = {"invisible":true}
C_OBJECT($obActivity)
C_LONGINT($0; $i)


$obActivity:=Get process activity
For ($i; 0; $obActivity.processes.length-1)
	If ($obActivity.processes[$i].name="SQL connection handler")
		$0:=$0+1
	End if 
End for 
