var Kultie = Kultie || {}
Kultie.FilterSystem = Kultie.FilterSystem || {}
Kultie.FilterSystem.FilterBase = class extends PIXI.Filter{
  constructor(code, timeBase, uniforms){
    super(null,code,uniforms);

    if(timeBase){
      this._timeBase = true;
      this.uniforms.uTime = 0.0;
    }    

    if(uniforms){
        for(var key in uniforms){
          this.uniforms[key] = uniforms[key];
        }
    }
  }

  update(dt){
    if(this._timeBase){
      this.uniforms.uTime += dt;
    }
  }
    
  applyDimension(input){
    this.uniforms.dimensions[0] = input.sourceFrame.width
    this.uniforms.dimensions[1] = input.sourceFrame.height
  }

  getMousePosition(){
    let mousePos = app.renderer.plugins.interaction.mouse.global;
    let x = mousePos.x;
    let y = mousePos.y;
    return [x,y]
  }
}

Kultie.FilterSystem.SnowFilter = class extends Kultie.FilterSystem.FilterBase{
  constructor(){
    super(snowShader,true);
  }

  update(dt){
    super.update(dt);
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

  update(dt){
    super.update(dt);
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

  update(dt){
    super.update(dt);
  }
}

Kultie.FilterSystem.ShinyFilter = class extends Kultie.FilterSystem.FilterBase{
  constructor(){
    super(shinyShader,true);
  } 

  update(dt){
    super.update(dt);
  }
}

Kultie.FilterSystem.ShockWave = class extends Kultie.FilterSystem.FilterBase{
  constructor(position){
    super(shockwaveShader,true,{
      uPosition: position
    })
  }

  update(dt){
    super.update(dt);
  }
}

Kultie.FilterSystem.NorctunalVision = class extends Kultie.FilterSystem.FilterBase{
  constructor(sprite, radius){
    const maskMatrix = new PIXI.Matrix();
    sprite.renderable = false;
    super(nocturnalVision, true);

    this.maskSprite = sprite;
    this.maskMatrix = maskMatrix;
    sprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    this.uniforms.mapSampler = sprite.texture;
    this.uniforms.filterMatrix = maskMatrix;
    this.uniforms.uPosition = [0,0];
    this.uniforms.uRadius = radius;
  }

  apply(filterManager, input, output){
    this.applyDimension(input);
    this.uniforms.filterMatrix = filterManager.calculateSpriteMatrix(this.maskMatrix,this.maskSprite);
    filterManager.applyFilter(this,input,output);
  }

  update(dt){
    super.update(dt);
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


const cat = PIXI.Sprite.from('images/cat.png');
// cat.width = app.screen.width;
// cat.height = app.screen.height;
// cat.x = app.screen.width/2;
// cat.y = app.screen.width/2;
app.stage.addChild(cat);

const noise = PIXI.Sprite.from('images/noise.png');

cat.addChild(fullScreen);

let customFilter = new Kultie.FilterSystem.SnowFilter();
app.stage.filters = [customFilter]

app.ticker.add((delta) =>{  
    customFilter.update(0.0167);
})
