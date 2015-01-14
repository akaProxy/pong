function connectToUser(request){
	var connection = request.accept();
	var user = new ConnectedUser();
	user.connection = connection;
	//user.id = generateUUID();
	console.log("A user connected");

	user.connection.on("message", function (message){
		handleMessage(message);
	});
	return user;
}
function ConnectedUser() {
	this.connection;
	this.id;

	this.send = function (message){
		this.connection.sendUTF(message);
	}
}

function handleMessage(message){
	if(message.type === "utf8"){
		console.log("handling message: " + message.utf8Data);
		var string = message.utf8Data;
		var commands = string.split(";");
		for (var a = 0; a < commands.length; a++) {
			var inputs = commands[a].split(":");
			var method = inputs[0];

			//This is the actual api

			if(method === "chat"){

				console.log("chatting!");
				var params = [];

				for (var i = 1; i < inputs.length; i++) {
					params.push(inputs[i]);
				};

				chat(params);
			}

		}
	}
}

function chat(params){
	var activeUsers = require("./backend").activeUsers;
	var recipiants = params[0].split(",");
	var message = params[1];

	console.log(message);

	for (var a = 0; a < recipiants.length; a++) {
		console.log("in loop 1, recipiants: " + recipiants[a]);
		for (var i = 0; i < activeUsers.length; i++) {
			console.log("activeUser: " + activeUsers[i].id);
			if(recipiants[a] == activeUsers[i].id){
				console.log("sending message: " + message + ", to: " + activeUsers[i].id);
				activeUsers[i].send(message);
			}
		}
	}
}


exports.handleMessage = handleMessage;
exports.connectToUser = connectToUser;