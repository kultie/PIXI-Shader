var Kultie = Kultie || {}
Kultie.Utils = class{
    static clamp(value,min,max){
        return Math.min(Math.max(value,min),max);
    }
}
Kultie.PhysicSprite = class{
    constructor(sprite){
        this._sprite = sprite;
        this.initPhysics();
    }
    initPhysics(){
        this._accelerationX = 0;
        this._accelerationY = 0;
        this._speedLimit = 5;
        this._friction = 0.96;
        this._bounce = -0.7;
        this._gravity = 0.3;
        this._vx = 0;
        this._vy = 0;
    }

    initPhysicsPlatformer(){
        this._isOnGround = false;
        this._jumpForce = -10;
    }

    move(){
        this._sprite.x += this._vx;
        this._sprite.y += this._vy;
    }

    handleMovement(moveUp,moveDown,moveLeft,moveRight){
        if(moveUp && !moveDown)
        {
            this._accelerationY = -0.2;
            this._friction = 1;
        }
        //Down
        if(moveDown && !moveUp)
        {
            this._accelerationY = 0.2;
            this._friction = 1;
        }
        //Left
        if(moveLeft && !moveRight)
        {
            this._accelerationX = -0.2;
            this._friction = 1;
        }
        //Right
        if(moveRight && !moveLeft)
        {
            this._accelerationX = 0.2;
            this._friction = 1;
        }

        if(!moveUp && !moveDown)
        {
            this._accelerationY = 0;
            this._vy = 0; 
        }
        if(!moveLeft && !moveRight)
        {
            this._accelerationX = 0;
            this._vx = 0; 
        }

        if(!moveUp && !moveDown && !moveLeft && !moveRight)
        {
            cat.friction = 0.96;
        }
    }

    update(app){
        this._vx += this._accelerationX;
        this._vy += this._accelerationY;
        this._vx *= this._friction;
        this._vy *= this._friction;
        this._vx = Kultie.Utils.clamp(this._vx, -this._speedLimit, this._speedLimit);
        this._vy = Kultie.Utils.clamp(this._vy, -this._speedLimit, this._speedLimit);
        this._sprite.x += this._vx;
        this._sprite.y += this._vy;
        this._sprite.x = Kultie.Utils.clamp(this._sprite.x, 0, app.screen.width - this._sprite.width);
        this._sprite.y = Kultie.Utils.clamp(this._sprite.y, 0, app.screen.height - this._sprite.height);

    }
}

const app = new PIXI.Application({
    width: 600,
    height: 600
  });
document.body.appendChild(app.view);


var UP = 38;
var DOWN = 40;
var RIGHT = 39;
var LEFT = 37;
//Directions
var moveUp = false;
var moveDown = false;
var moveRight = false;
var moveLeft = false;
//Add keyboard listeners
window.addEventListener("keydown", function(event)
{
  switch(event.keyCode)
  {
    case UP:
      moveUp = true;
      break;
    case DOWN:
      moveDown = true;
      break;
    case LEFT:
      moveLeft = true;
      break;
    case RIGHT:
      moveRight = true;
      break;
}
}, false);

window.addEventListener("keyup", function(event)
{
  switch(event.keyCode)
  {
    case UP:
      moveUp = false;
      break;
      case DOWN:
      moveDown = false;
      break;
    case LEFT:
      moveLeft = false;
      break;
    case RIGHT:
      moveRight = false;
      break;
}
}, false);



let cat = PIXI.Sprite.from("images/cat.png");
app.stage.addChild(cat);

let catPhysic = new Kultie.PhysicSprite(cat);

update = function(dt){
    catPhysic.handleMovement(moveUp,moveDown,moveLeft,moveRight);
    catPhysic.update(app);
}

app.ticker.add(update);