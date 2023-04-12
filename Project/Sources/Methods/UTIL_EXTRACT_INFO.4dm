//%attributes = {"invisible":true}
C_TEXT($1; $2; $0)
C_LONGINT($pos1; $pos2)
$pos1:=Position($2; $1)
$pos2:=Position("\n"; $1; $pos1)
$0:=Substring($1; $pos1; $pos2-$pos1)+"<br>"