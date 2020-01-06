var Kultie = Kultie || {}

const app = new PIXI.Application({
  width: 600,
  height:600
});
document.body.appendChild(app.view);

Kultie.NoiceFilter = class extends PIXI.Filter{
  constructor(resolution, sprite){
    super(null, limitVisionShader);
    this.uniforms.iResolution = [1.,1.];
    this.sprite = sprite;
    this.matrix = new PIXI.Matrix();
    this.uniforms.uMap = sprite.texture;
    this.uniforms.uRadius = 0.2;

  }

  apply(filterManager, input, output){
    this.uniforms.filterMatrix = filterManager.calculateSpriteMatrix(this.matrix, this.sprite);
    filterManager.applyFilter(this,input,output);
  }

  update(dt){
    let mousePos = app.renderer.plugins.interaction.mouse.global;
    this.uniforms.iMouse = [mousePos.x,mousePos.y];
  }
}

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

const asdasd = new Kultie.NoiceFilter([app.screen.width, app.screen.height], noise);
app.stage.filters = [asdasd];
app.ticker.add((delta) =>{ 
  asdasd.update(1/60);
})

