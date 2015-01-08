var speedConstant = 5;
var key = function(){
  var isDown = {};
    var up = function(e){
      isDown[e.keyCode] = false;
        //if(keys[e.keyCode])return;
        //keys[e.keyCode] = true;
        //console.log(keys);
        //Spelare 1:
        var prutt = false;
        switch(e.keyCode){
                
            case 38: 
            case 40: 
                platform1.setVelocity(0);
                break;

            //Spelare 2:
            case 87:
            case 83:
                  platform2.setVelocity(0);
                  break;
        }
        
      console.log("up " + e.keyCode);
    };
    var down = function(e){
      if(!isDown[e.keyCode]){
      isDown[e.keyCode] = true;
          switch(e.keyCode){
            //Spelare 1
            case 38:
                  platform1.setVelocity(-speedConstant);
                  break;
            case 40:
                  platform1.setVelocity(speedConstant);
                  break;
            
            //Spelare 2:
            case 87:
                  platform2.setVelocity(-speedConstant);
                  break;
            case 83:
                  platform2.setVelocity(speedConstant);
                  break;
          }
        console.log("down " + e.keyCode);
        //keys[e.keyCode] = undefined;
      }
    };
    return {up:up,down:down};
}();

window.addEventListener('keydown',key.down,false);
window.addEventListener('keyup',key.up,false);