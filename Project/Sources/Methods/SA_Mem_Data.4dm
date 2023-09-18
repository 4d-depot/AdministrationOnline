//%attributes = {"invisible":true}
C_OBJECT($0)
ARRAY TEXT($atMemLabels; 0)
ARRAY REAL($arMemValues; 0)
ARRAY REAL($atCounter; 0)

ARRAY TEXT($atLabels; 0)
ARRAY REAL($arVals; 0)

GET MEMORY STATISTICS(1; $atMemLabels; $arMemValues; $atCounter)
$0:=New object
$0:=UTIL_Array_to_Object(->$atMemLabels; ->$arMemValues)

APPEND TO ARRAY($atLabels; "Free")
APPEND TO ARRAY($arVals; Round($0.Free_Memory/(1024^2); 0))

APPEND TO ARRAY($atLabels; "Used by 4D")
APPEND TO ARRAY($arVals; Round($0.Used_physical_memory/(1024^2); 0))

APPEND TO ARRAY($atLabels; "Others")
APPEND TO ARRAY($arVals; Round(($0.Physical_Memory_Size-$0.Used_physical_memory-$0.Free_Memory)/(1024*1024); 0))


$0.Physical_Memory_Size:=Round($0.Physical_Memory_Size/(1024^3); 0)
OB SET ARRAY($0; "memLabels"; $atLabels)
OB SET ARRAY($0; "memData"; $arVals)

