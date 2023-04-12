//%attributes = {"invisible":true}
C_LONGINT($Lon_build)
C_TEXT($Txt_info; $Txt_major; $Txt_minor; $Txt_release; $Txt_version; $0)

$Txt_version:=Application version($Lon_build)

$Txt_major:=$Txt_version[[1]]+$Txt_version[[2]]  // version number for example 17
$Txt_release:=$Txt_version[[3]]  //Rx
$Txt_minor:=$Txt_version[[4]]  //.x

$Txt_info:="4D v"+$Txt_major
If ($Txt_release="0")  //4D v14.x
	$Txt_info:=$Txt_info+Choose($Txt_minor#"0"; "."+$Txt_minor; "")
	
Else   //4D v14 Rx
	$Txt_info:=$Txt_info+" R"+$Txt_release
End if 

$0:=$Txt_info+" (build "+String($Lon_build)+")"
