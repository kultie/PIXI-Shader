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
    super(twistedShader,{
      uPosition: [0.,0.],
      uRadius: .5,
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

Kultie.FilterSystem.RayMarching3D = class extends Kultie.FilterSystem.FilterBase{
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

Kultie.FilterSystem.RayMarching2D = class extends Kultie.FilterSystem.FilterBase{
  constructor(){
    super(rayTracing2D,{
      uTime: 0.,
      uPosition: [0.,0.]
    });
  }

  internalUpdate(dt){
    this.uniforms.uPosition = this.getMousePosition();
  }
}

Kultie.FilterSystem.TestMultipleTexture = class extends Kultie.FilterSystem.FilterBase{
  constructor(sprite1, sprite2){
    const maskMatrix = new PIXI.Matrix();
    sprite1.renderable = false;
    sprite2.renderable = false;
    super(testMultieTexture);

    this.maskSprite = sprite1;
    this.maskMatrix = maskMatrix;
    sprite1.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    sprite2.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    this.uniforms.u_tex_1 = sprite1.texture;
    this.uniforms.u_tex_2 = sprite2.texture;
    this.uniforms.filterMatrix = maskMatrix;
    this.uniforms.uTime = 0.;
  }

  apply(filterManager, input, output){
    this.uniforms.filterMatrix = filterManager.calculateSpriteMatrix(this.maskMatrix,this.maskSprite);
    filterManager.applyFilter(this,input,output);
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


const image = PIXI.Sprite.from('images/Panel.png');
// image.width = app.screen.width;
// image.height = app.screen.height;
image.anchor.x = .5;
image.anchor.y = .5;
image.x = app.screen.width/2;
image.y = app.screen.width/2;
image.scale.x = 3.;
image.scale.y = 3.;
app.stage.addChild(image);

const noise = PIXI.Sprite.from('images/noise.png');
app.stage.addChild(noise);
const disp = PIXI.Sprite.from('images/Displacements.png');
app.stage.addChild(disp);

let customFilter = new Kultie.FilterSystem.RayMarching3D(noise,disp);
// image.filterArea = app.renderer.screen;
customFilter.padding = 0.;
app.stage.filters = [customFilter];

const sequence = new Kultie.BT_Composite_Sequence("Check number",
  [
  Kultie.BT_Action.createAction("Generate number",
    (subject, context)=>{
      console.log("Target number is: " + context.targetNumber);
    },
    (subject, context)=>{
      let number = Math.floor(Math.random() * 10);
      context.currentNumber = number;
      subject._status = 'success';
      return 'success';
    },
    (subject, context)=>{
      console.log("Status: " + subject._status);
      console.log("Current number: " + context.currentNumber);
    }),
  Kultie.BT_Action.createAction("Check number",
    (subject, context)=>{
      console.log("Target number is: " + context.targetNumber + " Current number " + context.currentNumber);
    },
    (subject,context)=>{
      if(context.currentNumber == context.targetNumber){
        subject._status = 'success';
      }
      else{
        subject._status = 'fail';  
      }
      console.log(subject._status);
      return subject._status;
    }
  )
  ]);

let context = {targetNumber: 0};

const tree = new Kultie.BT_Root(sequence);

app.ticker.add((delta) =>{  
  tree.update(0.0167,context);
    customFilter.update(0.0167);
})
