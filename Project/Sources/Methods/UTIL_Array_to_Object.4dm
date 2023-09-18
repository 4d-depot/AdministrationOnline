//%attributes = {"invisible":true}
C_OBJECT($0)
C_POINTER($1; $2)
C_TEXT($label)
C_LONGINT($i)

For ($i; 1; Size of array($1->))
	$label:=Replace string($1->{$i}; " "; "_")
	OB SET($0; $label; $2->{$i})
End for 

