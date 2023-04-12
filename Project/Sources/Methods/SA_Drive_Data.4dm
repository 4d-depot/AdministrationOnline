//%attributes = {"invisible":true}
C_OBJECT($0; $obDrive)
ARRAY TEXT($atLabels; 0)
ARRAY REAL($arVals; 0)
C_REAL($size; $used; $free; $dataSize)
C_TEXT($dataFile; $volume)
C_LONGINT($pos)

$dataFile:=Data file
VOLUME LIST($atVols)

// Find drive for data file

$pos:=Position(Folder separator; $dataFile)

If (Is macOS)
	$volume:=Substring($dataFile; 1; $pos-1)
Else 
	$volume:=Substring($dataFile; 1; $pos)
End if 


If (Find in array($atVols; $volume)>0)
	
	VOLUME ATTRIBUTES($volume; $size; $used; $free)
	$obDrive:=New object
	
	APPEND TO ARRAY($atLabels; "Free")
	APPEND TO ARRAY($arVals; Round($free/(1024^3); 0))
	
	$dataSize:=Get document size($dataFile)
	
	APPEND TO ARRAY($atLabels; "Data")
	APPEND TO ARRAY($arVals; Round($dataSize/(1024^3); 4))
	
	APPEND TO ARRAY($atLabels; "Others")
	APPEND TO ARRAY($arVals; Round(($used-$dataSize)/(1024^3); 0))
	
	$obDrive.driveSize:=Round(($size)/(1024^3); 0)
	
	OB SET ARRAY($obDrive; "driveLabels"; $atLabels)
	OB SET ARRAY($obDrive; "driveData"; $arVals)
End if 
$0:=$obDrive