var WebSocketServer = require('websocket').server;
var APIInternal = require("./apiToInternal");
var httpServerFactory = require("./server");
var constants = require("./settings");
var httpServer1 = httpServerFactory.startAndGetServer(constants.PORT);
var httpServerL = httpServerFactory.startAndGetServer(constants.PORT_L);
var httpServerR = httpServerFactory.startAndGetServer(constants.PORT_R);

var wsServer1 = new WebSocketServer({
    httpServer: httpServer1,
    autoAcceptConnections: false
});
var wsServerL = new WebSocketServer({
    httpServer: httpServerL,
    autoAcceptConnections: false
});
var wsServerR = new WebSocketServer({
    httpServer: httpServerR,
    autoAcceptConnections: false
});

var client = null;
var left = null;
var right = null;

wsServer1.on("request", function(request){
	if(!client) client = request.accept();
    
    client.sendUTF("Hello! :) ");
    
    if(left) client.sendUTF(constants.PORT_L + " connected")
    if(right) client.sendUTF(constants.PORT_L + " connected")
    
	client.on("close", function(reasonData, description) {
		//Remove user from active users
		client = null;
	});
});

wsServerL.on("request", function(request){
	if(!left) left = request.accept();
    
    left.sendUTF("Hello! :) left");
    
    left.on("message", function(message){
        var newMsg = constants.PORT_L + " " + message.utf8Data;
        if(client) client.sendUTF(newMsg);
        console.log(newMsg);
    });
    
	left.on("close", function(reasonData, description) {
		//Remove user from active users
		left = null;
	});
});

wsServerR.on("request", function(request){
	if(!right) right = request.accept();
    
    right.sendUTF("Hello! :) right");
    
    right.on("message", function(message){
        var newMsg = constants.PORT_R + " " + message.utf8Data;
        if(client) client.sendUTF(newMsg);
        console.log(newMsg);
    });
    
	right.on("close", function(reasonData, description) {
		//Remove user from active users
		right = null;
	});
});

