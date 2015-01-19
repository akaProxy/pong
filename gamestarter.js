// First, some settings:

var port = 1337;
var portP1 = 1338;
var portP2 = 1339;
var ip = "192.168.0.254";
var WS_START = "ws://";
var connectMsg = "connected";

var onOpenLogM = "Connected to " + WS_START + ip + ":" + port;

var NUM_CONNECTED = 0,
    RETRY_TIME = 500,
    RETRIES = 5,
    RETRY_FAIL_MSG = "There is trouble connecting to the server, it might not be running or having other comunication errors.\nTry fixing the problem and pressing the message below to try again";



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
        startBtn.onclick = startGameFunction;
    }
}

var wsFailed;
var start = function(){
    wsFailed=false;
    littleConsole.textContent = "Connecting to websocket...";
    littleConsole.classList.remove('fail');
    
    var conectionError = function(){
        var tries = 0;
        return function(exeption){
            console.warn("connection failed");
            if(++tries>=RETRIES){
                //well, this is not gonna work...
                wsFailed=true;
                littleConsole.textContent = "Failed to connect to websocket :(";
                littleConsole.classList.add('fail');
                alert(RETRY_FAIL_MSG);
            }else{
                //catch failed do the try again
                window.setTimeout(openWS,RETRY_TIME);
            }
        }
    }();
    var openWS = function(){
        var ws = new WebSocket(WS_START + ip + ":" + port);
        ws.addEventListener("error", conectionError);
        ws.addEventListener("open", function(event){
            //prevent the conectionError function from running att websocet closing
            this.removeEventListener("error", conectionError);
            //clear memory
            conectionError=null;
            
            NUM_CONNECTED++
            checkIfPlayable();
            littleConsole.textContent = "Connected to websocket!";
        });

        ws.addEventListener("message", function(event){
            console.log(event.data);
            if(event.data == portP1 + " " + connectMsg){
                p1Text.textContent = "P1 Connected!";
                NUM_CONNECTED++;
                checkIfPlayable();
            }
            else if(event.data == portP2 + " " + connectMsg){
                p2Text.textContent = "P2 Connected!";
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
    };
    openWS();
};
start();
document.getElementById("littleConsole").addEventListener('click',function(){
    if(wsFailed)start();
});