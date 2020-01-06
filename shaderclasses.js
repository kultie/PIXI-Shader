var Kultie = Kultie || {};
Kultie.Filters = Kultie.Filters || {};
Kultie.FilterBase = class extends PIXI.Filter{
    constructor(code, uniform){
        let uniforms = uniform || {};
        uniforms.iTime = 0.0;
        uniforms.iMouse = [0.,0.];
        super(null,code, uniforms);       
    }

    update(dt){
        console.log(dt);
        this.uniforms.iTime += dt;
        let mousePos = app.renderer.plugins.interaction.mouse.global;
        this.uniforms.iMouse = [mousePos.x,mousePos.y];
    }
}

Kultie.Filters.Inverse = class extends Kultie.FilterBase{
    constructor(){
        super(inverseColorShader);
        this.uniforms.iTime = 0.;
    }
}

Kultie.Filters.LimitVision = class extends Kultie.FilterBase{
    constructor(){
        super(limitVisionShader,{uRadius:0.2});
        this.uniforms.uRadius = 0.2;
    }
    update(dt){
       super.update(dt);
    }
}