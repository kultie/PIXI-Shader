var Kultie = Kultie || {}
Kultie.FilterSystem = Kultie.FilterSystem || {}
Kultie.FilterSystem.FilterBase = class extends PIXI.Filter{
  constructor(code,uniforms){
    super(null,code,uniforms);
    if(uniforms){
        for(var key in uniforms){
          this.uniforms[key] = uniforms[key];
        }
    }
  }

  update(dt){
    if(this.uniforms.uTime !== null){
      this.uniforms.uTime += dt;
    }
    this.internalUpdate(dt);
  }

  internalUpdate(dt){

  }
    
  applyDimension(input){
    this.uniforms.dimensions[0] = input.sourceFrame.width
    this.uniforms.dimensions[1] = input.sourceFrame.height
  }

  getMousePosition(){
    let mousePos = app.renderer.plugins.interaction.mouse.global;
    let x = mousePos.x;
    let y = mousePos.y;
    return [x/app.screen.width,y/app.screen.height]
  }
}

Kultie.FilterSystem.Silxar = class extends Kultie.FilterSystem.FilterBase{
  constructor(){
    super(silexarsShader, {
      uTime: 0.
    });
  }
}

Kultie.FilterSystem.SnowFilter = class extends Kultie.FilterSystem.FilterBase{
  constructor(){
    super(snowShader,{
      uTime: 0.
    });
  }
}

Kultie.FilterSystem.TwistedFilter = class extends Kultie.FilterSystem.FilterBase{
  constructor(){
    super(twistedShader,true,{
      uPosition: [0.,0.],
      uRadius: .2,
      uAngle: 1.,
      uTime: 0.
    })
  }

  internalUpdate(dt){
    this.uniforms.uPosition = this.getMousePosition();
  }
}

Kultie.FilterSystem.LimitVisionFilter = class extends Kultie.FilterSystem.FilterBase{
  constructor(){
    super(limitVisionShader,false,{
      uPosition: [0.,0.],
      uRadius: .2,
    })
  }

  internalUpdate(dt){
    this.uniforms.uPosition = this.getMousePosition();
    this.uniforms.uRadius = this.getMousePosition()[0];
  }
}

Kultie.FilterSystem.ShinyFilter = class extends Kultie.FilterSystem.FilterBase{
  constructor(){
    super(shinyShader,true);
  } 

  internalUpdate(dt){
  }
}

Kultie.FilterSystem.ShockWave = class extends Kultie.FilterSystem.FilterBase{
  constructor(){
    super(shockwaveShader,true,{
      uPosition: [0.,0.],
      uTime: 0.
    })
  }

  internalUpdate(dt){
    this.uniforms.uPosition = this.getMousePosition();
  }
}

Kultie.FilterSystem.NorctunalVision = class extends Kultie.FilterSystem.FilterBase{
  constructor(sprite, radius){
    const maskMatrix = new PIXI.Matrix();
    sprite.renderable = false;
    super(nocturnalVision);

    this.maskSprite = sprite;
    this.maskMatrix = maskMatrix;
    sprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    this.uniforms.mapSampler = sprite.texture;
    this.uniforms.filterMatrix = maskMatrix;
    this.uniforms.uPosition = [0,0];
    this.uniforms.uRadius = radius; 
    this.uniforms.uTime = 0.;   
  }

  apply(filterManager, input, output){
    this.uniforms.filterMatrix = filterManager.calculateSpriteMatrix(this.maskMatrix,this.maskSprite);
    filterManager.applyFilter(this,input,output);
  }

  internalUpdate(dt){
    this.uniforms.uPosition = this.getMousePosition();
    this.uniforms.uRadius = Math.sin(this.uniforms.uTime);
  }
}

Kultie.FilterSystem.RayMarching = class extends Kultie.FilterSystem.FilterBase{
  constructor(){
    super(rayMarching,{
      uTime: 0.,
      uPosition: [0.,0.]
    });
  }

  internalUpdate(dt){
    this.uniforms.uPosition = this.getMousePosition();
  }
}

const app = new PIXI.Application({
  width: 600,
  height: 600
});
document.body.appendChild(app.view);

const fullScreen = new PIXI.Sprite();
fullScreen.width = app.screen.width;
fullScreen.height = app.screen.height;


const scary = PIXI.Sprite.from('images/cat.png');
scary.width = app.screen.width;
scary.height = app.screen.height;
// cat.x = app.screen.width/2;
// cat.y = app.screen.width/2;
app.stage.addChild(scary);
scary.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT

const noise = PIXI.Sprite.from('images/noise.png');

let customFilter = new Kultie.FilterSystem.RayMarching();
app.stage.filterArea = app.renderer.screen;
app.stage.filters = [customFilter];

app.ticker.add((delta) =>{  
    customFilter.update(0.0167);
})
