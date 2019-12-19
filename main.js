const app = new PIXI.Application({
  width: 1580,
  height: 745
});
document.body.appendChild(app.view);
// for(let i = 0; i < 10; i++){
//   const cat = PIXI.Sprite.from('images/cat.png');
//   cat.x = Math.random() * app.screen.width;
//   cat.y = Math.random() * app.screen.height;
//   app.stage.addChild(cat);
// }

const cat = PIXI.Sprite.from('images/cat.png');
cat.width = app.screen.width;
cat.height = app.screen.height;
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

const inverseColorShader = `
precision mediump float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform vec3 iResolution;
uniform float iTime;

void main(){
  gl_FragColor = texture2D(uSampler, vTextureCoord);
  gl_FragColor.rgb  = 1.0 - gl_FragColor.rgb;
}`

const pixelateShader = `
precision mediump float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform vec3 iResolution;
uniform float iTime;
uniform float amount;

void main(){
  vec2 uv = vTextureCoord;
  vec2 c = mix(iResolution.xy, vec2(4), amount);
  uv = floor(uv * c) / c;
  gl_FragColor = texture2D(uSampler, uv);
}`

const shinyShader = `
precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float iTime;
void main() {
  vec2 r = vTextureCoord;
  float col = sin(-r.y + r.x/2. - iTime * 5.) * 0.9;
  col *= col * col * 0.6;
  col = clamp(col,0.,1.);
  vec4 text = texture2D(uSampler, vTextureCoord);
  gl_FragColor = text + vec4(col) * text.a;
}
`

const silexarsShader = `
precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform vec3 iResolution;
uniform float iTime;

void main() {
  vec2 uv = vTextureCoord;
  vec3 wave_color = vec3(0.0);
  float wave_width = 0.0;
  uv = -3. + 2. * uv;
  uv.y += 0.;
  for(float i = 0.; i <= 28.; i++){
    uv.y += (0.2+(0.9*sin(iTime*0.4) * sin(uv.x + i/3.0 + 3.0 *iTime )));
    uv.x += 1.7* sin(iTime*0.4);
    wave_width = abs(1.0 / (200.0*abs(cos(iTime)) * uv.y));
    wave_color += vec3(wave_width *( 0.4+((i+1.0)/18.0)), wave_width * (i / 9.0), wave_width * ((i+1.0)/ 8.0) * 1.9);
  }
  vec4 newCol = vec4(wave_color,1.);
  vec4 text = texture2D(uSampler, vTextureCoord);
  gl_FragColor = newCol;
}`

const silexars2 = `
precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform vec3 iResolution;
uniform float iTime;

void main() {
  vec3 c;
	float l,z=iTime;
	for(int i=0;i<3;i++) {
		vec2 uv,p=vTextureCoord;
		uv=p;
		p-=.5;
		p.x*=iResolution.x/iResolution.y;
		z+=.07;
		l=length(p);
		uv+=p/l*(sin(z)+1.)*abs(sin(l*9.-z*2.));
		c[i]=.01/length(abs(mod(uv,1.)-.5));
	}
  vec4 newCol =vec4(c/l,iTime);
  vec4 text = texture2D(uSampler, vTextureCoord);
  gl_FragColor = newCol;
}
`;

const chromaticVibration =`
precision mediump float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform vec3 iResolution;
uniform float iTime;

void main(){
  vec2 uv = vTextureCoord;

	float amount = 0.0;
	
	amount = (1.0 + sin(iTime*6.0)) * 0.5;
	amount *= 1.0 + sin(iTime*16.0) * 0.5;
	amount *= 1.0 + sin(iTime*19.0) * 0.5;
	amount *= 1.0 + sin(iTime*27.0) * 0.5;
	amount = pow(amount, 3.0);

	amount *= 0.05;
	
    vec3 col;
    col.r = texture2D(uSampler, vec2(uv.x+amount,uv.y) ).r;
    col.g = texture2D(uSampler, uv ).g;
    col.b = texture2D(uSampler, vec2(uv.x-amount,uv.y) ).b;

	  col *= (1.0 - amount * 0.5);
	
    gl_FragColor = vec4(col,1.0);
}
`;

const customShader = `

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

float random (vec2 st) {
  return fract(sin(dot(st.xy,
                       vec2(12.9898,78.233)))*
      43758.5453123);
}

void main() {
  vec2 st = vTextureCoord;

  float rnd = random( st );

  gl_FragColor = vec4(vec3(rnd),1.0);
}
`;

const snowShader = `
#define pi 3.1415926

float T;

// iq's hash function from https://www.shadertoy.com/view/MslGD8
vec2 hash( vec2 p ) { p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))); return fract(sin(p)*18.5453); }

float simplegridnoise(vec2 v)
{
    float s = 1. / 256.;
    vec2 fl = floor(v), fr = fract(v);
    float mindist = 1e9;
    for(int y = -1; y <= 1; y++)
        for(int x = -1; x <= 1; x++)
        {
            vec2 offset = vec2(x, y);
            vec2 pos = .5 + .5 * cos(2. * pi * (T*.1 + hash(fl+offset)) + vec2(0,1.6));
            mindist = min(mindist, length(pos+offset -fr));
        }
    
    return mindist;
}

float blobnoise(vec2 v, float s)
{
    return pow(.5 + .5 * cos(pi * clamp(simplegridnoise(v)*2., 0., 1.)), s);
}

float fractalblobnoise(vec2 v, float s)
{
    float val = 0.;
    const float n = 4.;
    for(float i = 0.; i < n; i++)
        //val += 1.0 / (i + 1.0) * blobnoise((i + 1.0) * v + vec2(0.0, iTime * 1.0), s);
    	val += pow(0.5, i+1.) * blobnoise(exp2(i) * v + vec2(0, T), s);

    return val;
}

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform vec3 iResolution;
uniform float iTime;

void main()
{
    T = iTime;

    vec2 r = vec2(1.0, iResolution.y / iResolution.x);
	  vec2 uv = vTextureCoord;
    float val = fractalblobnoise(r * uv * 20.0, 5.0);
    gl_FragColor = mix(texture2D(uSampler, uv), vec4(1.0), vec4(val));
}
`;

let filter = createFilter(app.screen.width, app.screen.height,snowShader);
app.stage.filters = [filter];

app.ticker.add((delta) =>{
  filter.uniforms.iTime += 0.01;
})