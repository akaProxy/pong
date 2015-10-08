// First, some settings:

var port = 1337;
var portP1 = 1338;
var portP2 = 1339;
var ip = "localhost";
var WS_START = "ws://";
var connectMsg = "connected";

var onOpenLogM = "Connected to " + WS_START + ip + ":" + port;

var NUM_CONNECTED = 0;



var startBtn = document.getElementById("startBtn");
var p1Text = document.getElementById("p1");
var p2Text = document.getElementById("p2");
var littleConsole = document.getElementById("littleConsole");
var everything = document.getElementById("background");
var qr1dim = document.getElementById("qr1").getBoundingClientRect();
var qr2dim = document.getElementById("qr2").getBoundingClientRect();


new QRCode("qr1", {
    text: WS_START+ip+":"+portP1,
    width: qr1dim.width - 6,
    height: qr1dim.height - 6,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.L});
new QRCode("qr2", {
    text: WS_START+ip+":"+portP2,
    width: qr2dim.width - 6,
    height: qr2dim.height - 6,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.L});


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
        startBtn.onclick = startGameFunction;
    }
}

var ws = new WebSocket(WS_START + ip + ":" + port);
ws.addEventListener("open", function(event){
    NUM_CONNECTED++
    checkIfPlayable();
    littleConsole.innerHTML = "Connected to websocket!";
});

ws.addEventListener("message", function(event){
    console.log(event.data);
    if(event.data == portP1 + " " + connectMsg){
        p1Text.innerHTML = "P1 Connected!";
        NUM_CONNECTED++;
        checkIfPlayable();
    }
    else if(event.data == portP2 + " " + connectMsg){
        p2Text.innerHTML = "P2 Connected!";
        NUM_CONNECTED++;
        checkIfPlayable();
    }
    else if((/\d{4} .\d*\.\d*/g).test(event.data)){
        // First get first four digits
        var inPort = parseInt(event.data.substring(0,4));
        var angle = parseFloat(event.data.substring((inPort + " ").length));
        
        var speedRad = 20/(90);
        
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
