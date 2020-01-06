var Kultie = Kultie || {};

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

const asdasd = new Kultie.Filters.LimitVision();
app.stage.filters = [asdasd];
app.ticker.add((delta) =>{ 
  asdasd.update(1/60);
})

