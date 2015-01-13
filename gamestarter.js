// First, some settings:

var port = 1337;
var portP1 = 1338;
var portP2 = 1339;
var ip = "192.168.0.254";
var WS_START = "ws://";
var connectMsg = "connected";

var onOpenLogM = "Connected to " + WS_START + ip + ":" + port;

var NUM_CONNECTED = 0;



var startBtn = document.getElementById("startBtn");
var p1Text = document.getElementById("p1");
var p2Text = document.getElementById("p2");
var littleConsole = document.getElementById("littleConsole");
var everything = document.getElementById("background");

var startGameFunction = function(){
    document.getElementById("body").removeChild(everything);
    var canvas = document.createElement("canvas");
    canvas.setAttribute("id", "arena");
    document.getElementById("body").appendChild(canvas);
    startGame();
}

var checkIfPlayable = function(){
    if(NUM_CONNECTED == 3){
        startBtn.style.opacity = 1;
        startBtn.style.cursor = "pointer";
        startBtn.onclick = startGameFunction();
    }
}
startBtn.onclick=function(){
    startGameFunction();
}

var ws = new WebSocket(WS_START + ip + ":" + port);
ws.addEventListener("open", function(event){
    NUM_CONNECTED++
    startBtn.style.opacity = 1;
});

ws.addEventListener("message", function(event){
    if(event.message == portP1 + " " + connectMessage){
        p1Text.innerHTML = "P1 Connected!";
        NUM_CONNECTED++;
        checkIfPlayable();
    }
    else if(event.message == portP2 + " " + connectMessage){
        p2Text.innerHTML = "P2 Connected!";
        NUM_CONNECTED++;
        checkIfPlayable();
    }
    else if(/\d{4} \d{0,}[.]\d{0,}/.test(event.message)){
        // First get first four digits
        var inPort = /\d{4}/.match(event.message);
        var angle = event.message.substring((inPort + " ").length);
        
        var speedRad = 20/(Math.PI/2);
        
        var speed = angle * speedRad;
        
        switch(inPort){
            case (portP1):
                platformL.setVelocity(speed);
                break;
            case (portP2):
                platformR.setVelocity(speed);
                break;
        }
    }
});
