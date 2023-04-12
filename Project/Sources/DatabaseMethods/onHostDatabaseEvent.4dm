var $1 : Integer

Case of 
	: ($1=On before host database startup)
		var $server : Object
		$server:=WEB Server(Web server database)
		$server.start()
End case 
