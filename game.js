//Settings:
var backgroundColor = "#000000";
var elementColor = "#FFFFFF";
var initialBallSpeed = 10; //How many px should we move per frame?
var randomV = Math.random() * (Math.PI/2) - Math.PI/4;

var initialBallK = Math.tan(randomV);

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

var Platform = function(height, width, startX, startY, boundY){
    // This ball will be used to check if we have hit the ball and after that change it's coordinates. 
    //this.balls = balls; //Maybe we will have multiple balls in the future...
    
    this.color = elementColor;
    this.height = parseInt(height);
    this.width = parseInt(width);
    
    //Where is the platform?
    this.x = startX;
    this.y = startY;
    
    //Not moving until we set a speed. Positive or negative value depending if we want to move up or down. 
    this.velocity = 0;
    
    //Just like the ball, except we only can move up or down.
    this.oldY = null;
    this.boundY = boundY;
};
Platform.prototype.setVelocity = function(velocity){
    this.velocity = velocity;
}
Platform.prototype.draw = function(canvasDrawer){
    canvasDrawer.fillStyle = backgroundColor;
    canvasDrawer.fillRect(parseInt(this.x), parseInt(this.oldY), this.width, this.height);
    
    canvasDrawer.fillStyle = this.color;
    canvasDrawer.fillRect(parseInt(this.x), parseInt(this.y), this.width, this.height);
}
Platform.prototype.move = function(){
    //Move if we are in bound
    if((this.y > 0 && this.velocity < 0)||((this.y + this.height) < this.boundY && this.velocity > 0)){
        this.oldY = this.y;
        this.y = this.y + this.velocity
    };
}
Platform.prototype.checkHitWithBall = function(ball){
    var x = ball.x;
    var oldX = ball.oldX;
    
    var line1 = this.x - ball.width;
    var line2 = this.x + this.width;
    
    var smallest = Math.min(x, oldX);
    var largest = Math.max(x, oldX);
}

var start = null;
var ball = new Ball(10, 10, width/2 - 5, height/2-5, canvas.width, canvas.height);

var platformR = new Platform(
    100,             // Height
    10,             // Width
    canvas.width - 40,             // StartX: 30px from right edge of canvas
    height/2 - 50,    // Start in the middle on y-axis
    canvas.height   // Only let it move so that we don't go outside of canvas
);

var platformL = new Platform(
    100,                 // Height
    10,                 // Width
    30,  // StartX: 30px (becomes 40px, because we need to count in the width of the platform) from left edge of canvas
    height/2-50,        // Start in the middle on y-axis
    canvas.height       // Only let it move so that we don't go outside of canvas)
);

var platforms = [platformR, platformL];
platformR.setVelocity(0);
platformL.setVelocity(0);
var running = true;
var step = function(timestamp){
    for(var i = 0; i < platforms.length; i++){
        platforms[i].move();
        platforms[i].draw(ctx);
    }
    
    var bouncyOnPlatform = function(platform,ball){
        var gradperl = Math.PI/2 / platform.height;
        
        var l = -(platform.y + platform.height/ 2 - ball.centerY);
        
        var grad = gradperl * l;
        
        var k = Math.tan(grad);
        
        var changeDir = 0;
        if(ball.dX > 0){ 
            changeDir = -1
        }
        else {
            changeDir = 1;
        }
        
        ball.setK(k);
        ball.dX = ball.dX * changeDir;
    }
    
    // Check for hits with ball
    var rightBound = platformR.x;
    var leftBound = platformL.x + platformL.width;
    
    // Hit with left platform
    if(ball.x < leftBound && ball.dX < 0){
        // change direction
        
        if(ball.y + ball.height > platformL.y && ball.y < platformL.y + platformL.height){
            bouncyOnPlatform(platformL, ball);
        }
    }
    
    // Hit with right platform
    if((ball.x + ball.width) > rightBound && ball.dX > 0){
        if(ball.y + ball.height > platformR.y && ball.y < platformR.y + platformR.height){
            bouncyOnPlatform(platformR, ball);
        }
    }
    
    
    ball.move();
    ball.draw(ctx);
      
    
    //Very advanced system for detection of winner. Please be careful when you
    //uncomment this. It could lead to a broken toe, or worse, a 
    //pinple on your elbow. Please uncomment with cuation. 
    
    if(ball.centerX <= 0){
        alert("alliansen vann!")
        running = false;
    }
    if(ball.centerX >= ball.boundX){
        alert("Lefty vann!");
        running = false;
    }
    if(running) window.requestAnimationFrame(step);
};
window.requestAnimationFrame(step);