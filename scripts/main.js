var Kultie = Kultie || {}

Kultie.FilterManager = class {
  constructor(){
    this._filterList = {};
  }

  createFilter(w,h,code,uniforms,include, id){
    let standardUniform = {
      iResolution: [w, h],
      iTime: 0.0,
      iMouse: [0.0,0.0]
    }  
    let shaderUniform = {...standardUniform,...uniforms}; 
    let filter = new PIXI.Filter(null, code, shaderUniform);
    if(include){
      this._filterList[id] = filter;
    }
    return filter;
  }

  update(dt){

    for(let key in this._filterList){
      if(this._filterList.hasOwnProperty(key)){
        let filter = this._filterList[key];
        filter.uniforms.iTime += dt;
        filter.uniforms.iMouse = this.convertMousePosition();
      }
    }
  }

  convertMousePosition(){
    let mousePos = app.renderer.plugins.interaction.mouse.global;
    let x = mousePos.x;
    let y = mousePos.y;
    return [x,y]
  }
}

const app = new PIXI.Application({
  width: 600,
  height:600
});
document.body.appendChild(app.view);

const fullScreen = new PIXI.Sprite();
fullScreen.width = app.screen.width;
fullScreen.height = app.screen.height;


const cat = PIXI.Sprite.from('images/cat.png');
cat.width = app.screen.width;
cat.height = app.screen.height;
// cat.x = app.screen.width/2;
// cat.y = app.screen.width/2;
app.stage.addChild(cat);

const noise = PIXI.Sprite.from('images/noise.png');

cat.addChild(fullScreen);

let filterManager = new Kultie.FilterManager();
let snowFilter = filterManager.createFilter(app.screen.width,app.screen.height,shockwaveShader,{},true,"snow");
let twistedFilter = filterManager.createFilter(app.screen.width,app.screen.height,twistedShader,{radius:0.5, angle:5},true,"twisted");
let customFilter = filterManager.createFilter(app.screen.width,app.screen.height,limitVisionShader,{uRadius: .5},true,"custom");
app.stage.filters = [customFilter]

app.ticker.add((delta) =>{  
  filterManager.update(0.0167);
})

