//%attributes = {"invisible":true}
C_TEXT($file; $xml; $xslDecaration; $item)
C_OBJECT($obVars)

$obVars:=UTIL_WEB_Get_Vars

Case of 
	: ($obVars.file="Verif")
		$file:=Get 4D file(Verification log file; *)
		
	: ($obVars.file="Compact")
		$file:=Get 4D file(Compacting log file; *)
		
	: ($obVars.file="Repair")
		$file:=Get 4D file(Repair log file; *)
	Else 
		$file:=""
		
End case 

If (Test path name($file)=Is a document)
	$xml:=Document to text($file; "UTF-8")
	
	$xslDecaration:="<?xml-stylesheet type = \"text/xsl\" href=\"LogStyleSheet.xsl\"?>"
	$item:="<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>"
	$xml:=Replace string($xml; $item; $item+$xslDecaration)
	
	WEB SEND TEXT($xml; "application/xml")
End if 

