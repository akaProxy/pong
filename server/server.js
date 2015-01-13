var http = require("http");
var constants = require("./settings");
function startAndGetServer(port){

	var httpServer = http.createServer(onRequest).listen(port, function(){
		console.log((new Date()) + ' HTTP server is listening on port ' + port);
	});

	function onRequest(request, response){
		console.log((new Date()) + " Recieved request for " + request.url)
		response.writeHead(200, {"Content-Type": "text/plain"});
	  	response.write("Hello World");
	  	response.end();
	}
	console.log("Server kör");

	return httpServer;
}
exports.startAndGetServer = startAndGetServer;


