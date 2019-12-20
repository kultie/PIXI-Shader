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
    let x = mousePos.x / app.screen.width;
    let y = mousePos.y / app.screen.height;
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
app.stage.addChild(fullScreen);

const cat = PIXI.Sprite.from('images/cat.png');
// cat.width = app.screen.width;
// cat.height = app.screen.height;
app.stage.addChild(cat);

var filterManager = new Kultie.FilterManager();
let filter = filterManager.createFilter(app.screen.width,app.screen.height,customShader,{},true,"custom");
let snowFilter = filterManager.createFilter(app.screen.width,app.screen.height,snowShader,{},true,"snow");
app.stage.filters = [filter,snowFilter]

app.ticker.add((delta) =>{  
  filterManager.update(0.0167);
})

