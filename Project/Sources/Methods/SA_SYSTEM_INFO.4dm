//%attributes = {"invisible":true}
C_OBJECT($obResult; $obCache)
C_TEXT($json; $ip; $type; $sep)
ARRAY TEXT($atMemLabels; 0)
ARRAY REAL($arMemValues; 0)
ARRAY REAL($atCounter; 0)

ARRAY TEXT($atLabels; 0)
ARRAY REAL($arVals; 0)
C_OBJECT($obResult; $objSys)
C_LONGINT($i; $j)

$objSys:=Get system info

For ($i; 0; $objSys.networkInterfaces.length-1)
	For ($j; 0; $objSys.networkInterfaces.length-1)
		$type:=$objSys.networkInterfaces[$i].ipAddresses[$j].type
		
		If ($type="ipv4")
			
			If ($i<($objSys.networkInterfaces.length-1))
				$sep:=", "
			Else 
				$sep:=""
			End if 
			
			$ip:=$ip+$objSys.networkInterfaces[$i].ipAddresses[$j].ip+$sep
		End if 
		
	End for 
End for 

$obCache:=Cache info

$obResult:=New object
$obResult.processor:=$objSys.processor
$obResult.osVersion:=$objSys.osVersion
$obResult.machine:=$objSys.machineName
$obResult.cores:=$objSys.cores
$obResult.threads:=$objSys.cpuThreads
$obResult.uptime:=$objSys.uptime
$obResult.ipAddresses:=$ip
$obResult.app:=SA_App_Info
$obResult.licenses:=SA_License_Info("BASIC")
$obResult.memory:=SA_Mem_Data
$obResult.maxCache:=$obCache.maxMem
$obResult.usedCache:=$obCache.usedMem
$obResult.drive:=SA_Drive_Data

$json:=JSON Stringify($obResult; *)
WEB SEND TEXT($json; "application/json")
