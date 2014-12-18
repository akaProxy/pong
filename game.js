
//Settings:
var backgroundColor = "#000000";
var elementColor = "#FFFFFF";
var initialBallSpeed = 20; //How many px should we move per frame?
var initialBallK = 3;


var canvas = document.getElementById("arena");
var height = window.innerHeight;
var width = window.innerWidth;

//canvas.style.backgroundColor = "#000000";
document.getElementsByName("body").height = height;
canvas.height = height;
canvas.width = width;

var ctx = canvas.getContext("2d");

//Draw background
ctx.fillStyle = backgroundColor;
ctx.fillRect(0,0,canvas.width, canvas.height);

var Ball = function(height, width, startX, startY, boundX, boundY){
    this.color = elementColor;
    this.height = height;
    this.width = width;
    
    //Where is the ball?
    this.x = startX;
    this.y = startY;
    
    //where is the center of the ball?
    this.centerX = this.x + width/2;
    this.centerY = this.y + height/2;
    
    //How much should we move each frame? 
    this.velocity = initialBallSpeed; 
    this.k = initialBallK;
    this.right = 1; //Should the ball go left or right? Right = 1, left = -1
    this.dX = null;
    this.dY = null;
    this.angle = Math.atan(this.k); //angle from horizontal plane
    if (this.right == -1) this.angle = this.angle + Math.PI;
    
    this.oldX = null;
    this.oldY = null;
    
    this.boundX = boundX;
    this.boundY = boundY;
};

Ball.prototype.draw = function(canvasDrawer){
    //first clear the ball
    ctx.fillStyle = backgroundColor;
    ctx.clearRect(ball.oldX, ball.oldY, ball.width, ball.height);
    ctx.fillRect(ball.oldX - 2, ball.oldY -2, ball.width +4, ball.height + 4); //Someone needs to take a look into this. Why doen't the ball get cleared when we only use oldX and oldY? 
    
    //Now, draw a new ball :D
    canvasDrawer.fillStyle = this.color;
    canvasDrawer.fillRect(this.x, this.y, this.width, this.height);
};
Ball.prototype.calculatedXdY = function(){
    var v = this.velocity;
    var k = this.k;
    
    //Pythaghoras sats, emaila John för en förklaring :)
    var calcdX = this.right * Math.sqrt((v * v)/(1 + k * k)); 
    var calcdY = k * calcdX;
    
    this.dX = calcdX;
    this.dY = calcdY;
};
Ball.prototype.move = function(){
    if (!this.dX || !this.dY) this.calculatedXdY();
    
    this.oldX = this.x;
    this.oldY = this.y;
    
    
    if(/*this.x >= this.boundX || this.x <= 0 || */this.y >= this.boundY || this.y <= 0){
        //We hit left or right wall!! D:
        if (this.x >= this.boundX || this.x <= 0) this.right = this.right * -1; //Change direction
        this.k = this.k * -1;
        this.calculatedXdY();
    }
    
    this.x = this.x + this.dX;
    this.y = this.y + this.dY;
    
    this.centerX = this.x + this.width/2;
    
};
var start = null;
var ball = new Ball(10, 10, width/2 - 5, height/2-5, canvas.width, canvas.height);

var running = true;
var step = function(timestamp){
    ball.draw(ctx);
    ball.move();
    
    if(running) window.requestAnimationFrame(step);
    if(ball.x <= 0){
        alert("Lefty vann!");
        running = false;
    }
    if(ball.x >= ball.boundX){
        alert("alliansen vann!")
        running = false;
    }
};
window.requestAnimationFrame(step);