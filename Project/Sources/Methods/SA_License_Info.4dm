//%attributes = {"invisible":true}
C_OBJECT($obSerial; $obRes; $0)
ARRAY OBJECT($aoProducts; 0)
C_TEXT($1)
C_LONGINT($i)

$obSerial:=Get license info

$0:=New object

Case of 
	: ($1="BASIC")
		$0.licenseName:=$obSerial.name
		$0.licensee:=$obSerial.userName+" - "+$obSerial.companyName
		
		For ($i; 0; $obSerial.products.length-1)
			
			If ($obSerial.products[$i].name="4D Client")
				$0.prod:=$obSerial.products[$i]
			End if 
			
		End for 
		
	: ($1="SQL")
		For ($i; 0; $obSerial.products.length-1)
			
			If ($obSerial.products[$i].name="4D SQL Server")
				$0.maxConns:=$obSerial.products[$i].allowedCount
				
			End if 
			
		End for 
		
End case 




