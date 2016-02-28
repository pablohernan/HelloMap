var config = {
		"domain":"nodejs-dondeestas.rhcloud.com",
		"serverip":"127.10.20.129",
		"serverport":"8080",
		"clientport":"8000",
		"protocol":"ws://",
		"heartbeattmo":1000,
		"timeEmit": 3000,
		"wsclientopts":{
				"reconnection":true,
				"reconnectionDelay":2000,
				"reconnectionAttempts":100,
				"secure":false
		}
}