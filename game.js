
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

//Draw backgroucanvasDrawerctx.fillStyle = backgroundColor;
ctx.fillRect(0,0,canvas.width, canvas.height);

var Ball = function(height, width, startX, startY, boundX, boundY){
    this.color = elementColor;
    this.height = parseInt(height);
    this.width = parseInt(width);
    
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
    canvasDrawer.fillStyle = backgroundColor;
    //canvasDrawer.clearRect(ball.oldX, ball.oldY, ball.width, ball.height);
    canvasDrawer.fillRect(parseInt(ball.oldX), parseInt(ball.oldY), ball.width, ball.height);
    
    //Now, draw a new ball :D
    canvasDrawer.fillStyle = this.color;
    canvasDrawer.fillRect(parseInt(this.x), parseInt(this.y), this.width, this.height);
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
Ball.prototype.setXfromCenter = function(center){
    this.x = center - this.width/2;
    return this.x;
}
Ball.prototype.setYfromCenter = function(center){
    this.y = center - this.height/2;
    return this.y;
}
Ball.prototype.move = function(){
    
    var checkHits = function(ball){
        
        var setRight = function(inVal, bound){
            
            var outside = inVal - bound;
            var result = bound - outside;
            return result;
        }

        //Vertical walls
        if(ball.centerX >= ball.boundX || ball.centerX < 0){

            //set position right
            
            if(ball.centerX > ball.boundX) { 
                 ball.setXfromCenter(setRight(ball.centerX, ball.boundX));
            }
            if(ball.centerX < 0) {
                ball.setXfromCenter(-ball.centerX);
            }
                
            //Bounce, go other direction
            ball.right = ball.right * -1;
            ball.dX = ball.dX * ball.right;
        };
        
        //Horizontal walls
        if(ball.centerY >= ball.boundY || ball.centerY <= 0){

            //set position right
            if(ball.centerY > ball.boundY){ 
                ball.setYfromCenter(setRight(ball.centerY, ball.boundY));
            }
            if(ball.centerY < 0){
                ball.setYfromCenter(-ball.centerY);
            }

            //Flip k, (but that is the same as a flip of dY
            ball.dY = -ball.dY;
        };
        
        //TODO: Check for a hit with platform
    }
    if (!this.dX || !this.dY) this.calculatedXdY();
    
    this.oldX = this.x;
    this.oldY = this.y;    
    
    //Check for wall hits
    
    checkHits(this);
    
    this.x = this.x + this.dX;
    this.y = this.y + this.dY;
    
    this.centerX = this.x + this.width/2;
    this.centerY = this.y + this.height/2;
    
};
Ball.prototype.setVelocity = function(vel){
    //Recalculate dX and dY. They are proportional to velocity
    var change = vel/this.velocity;
    this.dX = this.dX * change;
    this.dY = this.dY * change;
    this.velocity = vel;
};
Ball.prototype.setK = function(inK){
    this.k = inK;
    this.calculatedXdY();
};
var start = null;
var ball = new Ball(10, 10, width/2 - 5, height/2-5, canvas.width, canvas.height);

var running = true;
var step = function(timestamp){
    ball.draw(ctx);
    ball.move();
    
    if(running) window.requestAnimationFrame(step);
    
    //Very advanced system for detection of winner. Please be careful when you
    //uncomment this. It could lead to a broken toe, or worse, a 
    //pinple on your elbow. Please uncomment with cuation. 
    
    /*if(ball.centerX <= 0){
        alert("alliansen vann!")
        running = false;
    }
    if(ball.centerX >= ball.boundX){
        alert("Lefty vann!");
        running = false;
    }*/
};
window.requestAnimationFrame(step);