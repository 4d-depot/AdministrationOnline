//%attributes = {"invisible":true}
C_OBJECT($0)
ARRAY TEXT($atNombres; 0)
ARRAY TEXT($atValores; 0)
C_LONGINT($i)

WEB GET VARIABLES($atNombres; $atValores)

For ($i; 1; Size of array($atNombres))
	OB SET($0; $atNombres{$i}; $atValores{$i})
End for 

