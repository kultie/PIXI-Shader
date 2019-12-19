const app = new PIXI.Application();
document.body.appendChild(app.view);

const fullScreen = new PIXI.Sprite();
fullScreen.width = app.screen.width;
fullScreen.height = app.screen.height;
app.stage.addChild(fullScreen);

const cat = PIXI.Sprite.from('images/cat.png');
// cat.width = app.screen.width;
// cat.height = app.screen.height;
app.stage.addChild(cat);


function createFilter(w,h,shaderCode,uniforms){
  let standardUniform = {
    iResolution: [w, h, 1.0],
    iTime: 0.0,
  }  
  let shaderUniform = {...standardUniform,...uniforms}; 
  let filter = new PIXI.Filter(null, shaderCode, shaderUniform);
  return filter;
}

let silexarsFilter = createFilter(app.screen.width, app.screen.height,silexarsShader);
let filter = createFilter(app.screen.width, app.screen.height,snowShader);
app.stage.filters = [silexarsFilter,filter];

app.ticker.add((delta) =>{  
  silexarsFilter.uniforms.iTime += 0.01;
  filter.uniforms.iTime += 0.5;
})