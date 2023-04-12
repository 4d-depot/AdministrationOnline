//%attributes = {"invisible":true,"preemptive":"capable"}
C_OBJECT($obResult; $signal; $objSys)
ARRAY OBJECT($aoActivities; 0)
ARRAY TEXT($atStart; 0)
ARRAY LONGINT($alDuration; 0)
C_TEXT($json; $ip; $volume; $folder; $xml; $ref; $file)
C_DATE($date)
C_REAL($size; $used; $free)
C_BOOLEAN($signaled)
C_LONGINT($pos)

$obResult:=New object


$obResult.verifDate:=UTIL_Get_File_Creation_Date(Get 4D file(Verification log file; *))
$obResult.compactDate:=UTIL_Get_File_Creation_Date(Get 4D file(Compacting log file; *))
$obResult.repairDate:=UTIL_Get_File_Creation_Date(Get 4D file(Repair log file; *))

$signal:=New signal("GetBackupInfo")
CALL WORKER("Util_Worker"; "Util_Worker"; $signal)  // runs cooperative
$signaled:=$signal.wait(2)  // wait 2 seconds

$obResult.lastBackupDate:=String($signal.lastBackupDate)
$obResult.nextBackupDate:=String($signal.nextBackupDate)

$folder:=""
$file:=Get 4D file(Current backup settings file; *)
If (Test path name($file)=Is a document)
	$xml:=DOM Parse XML source($file)
	$ref:=DOM Find XML element($xml; "Preferences4D/Backup/Settings/General/DestinationFolder")
	
	DOM GET XML ELEMENT VALUE($ref; $folder)
	
	If ($folder="./@")
		$folder:=Get 4D folder(Database folder; *)
	End if 
	DOM CLOSE XML($xml)
	
	$obResult.backupFolder:=$folder
	
	If (Test path name($folder)=Is a folder)
		VOLUME LIST($atVols)
		// Find drive for data file
		$pos:=Position(Folder separator; $folder)
		
		If (Is macOS)
			$volume:=Substring($folder; 1; $pos-1)
		Else 
			$volume:=Substring($folder; 1; $pos)
		End if 
		$obResult.volume:=$volume
		
		If (Find in array($atVols; $volume)>0)
			VOLUME ATTRIBUTES($volume; $size; $used; $free)
			$obResult.driveFree:=Round($free/(1024^3); 0)
			
		End if 
	End if 
End if 

$objSys:=Get system info
$obResult.uptime:=$objSys.uptime

$json:=JSON Stringify($obResult; *)
WEB SEND TEXT($json; "application/json")