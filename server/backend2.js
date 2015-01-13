var WebSocketServer = require('websocket').server;
var APIInternal = require("./apiToInternal");
var httpServer = require("./server").startAndGetServer();

var wsServer = new WebSocketServer({
    httpServer: httpServer,
    autoAcceptConnections: false
});

var activeUsers = [];
var ids = [];
wsServer.on("request", function(request){
	var user = APIInternal.connectToUser(request);
	user.id = generateUUID();
	activeUsers.push(user);
	user.send("connection established. Currently " + activeUsers.length + " users connected");
	user.send("Your id is: " + user.id);



	user.connection.on("close", function(reasonData, description) {
		//Remove user from active users
		for (var i = 0; i < activeUsers.length; i++) {
			var idOfActiveUser;
			if(activeUsers[i].id === user.id) {
				idOfActiveUser = activeUsers[i].id;
				activeUsers.splice(i, 1);
			}
			var index = ids.indexOf(idOfActiveUser);
			ids.splice(index, 1);
		};
	});
});



function generateUUID(){
	ids.sort(function(a, b){return a-b});
	if(activeUsers.length > ids.length){
		//Take empty slot
		ids = [];
		console.log("There are more active users than ids. Taking empty slot");
		for (var i = 0; i < activeUsers.length; i++) {
			ids.push(activeUsers[i].id);
		};
		ids.sort(function(a, b){return a-b});

		if (ids[0] >= 2) {
			ids.push(1);
			ids.sort(function(a, b){return a-b});
			return 1;
		}
		else {
			for (var i = 1; i < ids.length; i++) {
				if (ids[i] - ids[i-1] >= 2){
					ids.push(ids[i-1] + 1);
					ids.sort(function(a, b){return a-b});
					return ids[i-1] + 1;
				} 
			};
			console.log("Never more than one space between two ids. Giving top id");
			ids.push(ids[ids.length - 1] + 1);
			console.log("ids length: " + ids.length);
			return ids[ids.length - 1];
		}
		

	}
	else {

		if(ids.length === 0){
			ids.push(1);
			return 1;
		} 
		else {
			var heighestId = ids[ids.length - 1];
			ids.push(heighestId + 1);
			return heighestId + 1;
		}
	}
}

exports.ids;
exports.activeUsers = activeUsers;