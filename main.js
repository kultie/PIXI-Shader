var Kultie = Kultie || {}

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

