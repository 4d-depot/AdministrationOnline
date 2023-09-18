//%attributes = {"invisible":true}
C_TEXT($0; $1)
C_BOOLEAN($locked; $invisible)
C_DATE($date; $modDate)
C_TIME($time; $modTime)

If (Test path name($1)=Is a document)
	GET DOCUMENT PROPERTIES($1; $locked; $invisible; $date; $time; $modDate; $modTime)
	$0:=String($date; ISO date; $time)
	$0:=Replace string($0; "T"; "&nbsp;&nbsp;&nbsp;")
Else 
	$0:=""
End if 