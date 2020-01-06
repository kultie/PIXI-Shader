const templateShaderCode =`
precision mediump float;
const float PI = 3.1415926535;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;

vec2 translate(vec2 uv, vec2 position){
    uv += position;
    return uv;
}

vec2 rotate(vec2 uv, float angle){
    float c = cos(angle);
    float s = sin(angle);
    mat2 mat = mat2(c,-s,s,c);
    uv -= vec2(.5);
    uv *= mat;
    uv += vec2(.5);
    return uv;
}

vec2 scale(vec2 uv, vec2 scale){
    mat2 mat = mat2(scale.x,.0,.0,scale.y);
    uv -= vec2(.5);
    uv *= mat;
    uv += vec2(.5);
    return uv;
}

void main(){
    //glsl standard uv;
    vec2 uv = gl_FragCoord.xy/iResolution;

    //PIXI standard uv;
    uv = vTextureCoord;

    gl_FragColor = vec4(vec3(1.0),1.0);
}`;


const customShader = `
precision mediump float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;

float plot(vec2 st, float pct){
  return smoothstep(pct-0.02, pct, st.y) - smoothstep(pct,pct+0.05,st.y);
}

vec3 rectangle(vec2 st,vec2 pos, float size){
  vec2 tlPos = pos - size/2.;
  vec2 brPos = vec2(1.-size) - tlPos;
  vec2 tl = step(tlPos,st);
  vec2 br = step(brPos, 1. - st);
  return vec3(tl.x * tl.y * br.x * br.y);
}

vec2 rotate(vec2 uv, float angle){
  float c = cos(angle);
  float s = sin(angle);
  mat2 mat = mat2(c,-s,s,c);
  uv -= vec2(.5);
  uv *= mat;
  uv += vec2(.5);
  return uv;
}

vec3 circle(vec2 st, vec2 pos, float radius){
  st.x *= iResolution.x/iResolution.y;
  float pct = 1. - step(radius,distance(st,vec2(pos)));

  return vec3(pct);
}

void main() {
  // Screen UVs
  // vec2 st = gl_FragCoord.xy / iResolution;
  //Built-in UVs
  vec2 st = vTextureCoord;
  vec3 color = vec3(0.);
  vec2 res = iResolution;
  // st = rotate(st, iTime);
  // res = rotate(res,abs(sin(iTime)));
  color += circle(st, vec2(.5,.5),.2);

  // vec3 color = rectangle(st, vec2(0.25,0.25), 0.5 * iResolution.y / iResolution.x);
  gl_FragColor = vec4(color,1.);
}
`;

const inverseColorShader = `
precision mediump float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec4 filterArea;
uniform float iTime;

void main(){
  gl_FragColor = texture2D(uSampler, vTextureCoord);
  gl_FragColor.rgb  = 1.0 * sin(iTime) - gl_FragColor.rgb;
}`

//https://www.shadertoy.com/view/3lBSR3
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

//https://www.shadertoy.com/view/XsGBzW
const shinyShader = `
precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float iTime;
void main() {
  vec2 r = vTextureCoord;
  float col = sin(-r.y + r.x - iTime * 5.) * 0.9;
  col *= col * col * 0.6;
  col = clamp(col,0.,1.);
  vec4 text = texture2D(uSampler, vTextureCoord);
  gl_FragColor = text * vec4(col);
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

//https://www.shadertoy.com/view/XsXXDn
const silexars2Shader = `
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

//https://www.shadertoy.com/view/Mds3zn
const chromaticVibrationShader =`
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

//https://www.shadertoy.com/view/4l2SW3
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

uniform float iTime;
uniform vec4 filterArea;

void main()
{
    T = iTime;

    vec2 r = vec2(1.0, 1.);
	vec2 uv = vTextureCoord;
    float val = fractalblobnoise(r * uv.yx * 50.0, 5.0);
    gl_FragColor = mix(texture2D(uSampler, uv), vec4(1.0), vec4(val));
}
`;

//https://www.shadertoy.com/view/MdX3zr
const flameShader = `
precision mediump float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform sampler2D noise;

uniform vec3 iResolution;
uniform float iTime;

float norm(float a, float b, float t) {
	return (t - a) / (b - a);
}

float map(float a, float b, float c, float d, float t) {
	return norm(a, b, t) * (d-c) + c;
}

float bar(float t, float s, float e, float blur) {
    //blur = 0.001; // for testing strips
    return smoothstep(s-blur, s+blur, t) * smoothstep(e+blur, e-blur, t);
}

vec3 blurredBar(vec2 uv, vec2 p, vec2 blur, vec3 color) {    
    float b = map(1.0, -1.0, blur.s, blur.t, uv.t);    
    b = pow(b, 2.0);
	return bar(uv.s, p.s, p.t, b) * color;
}

vec3 fire(vec2 uv) {
    
    const float maxblur = 1.0;
    const float minblur = 0.001;
    const float start = -0.1;
    const float end = 0.1;
    
    float y = uv.y;    
    float m = sin(y * 10.0 + iTime * 6.0) * 0.01;
    float x = uv.x - m;
    
    vec3 mask = blurredBar(vec2(x, y), vec2(start, end), vec2(maxblur, minblur), vec3(1.0, 1.0, 0.0)) +
        blurredBar(vec2(x, y), vec2(start-0.1, end+0.1), vec2(maxblur+0.2, minblur-0.2), vec3(1.0, 0.0, 0.0));
    
    vec3 fade = vec3(0.5) - y;
    
    return mask * fade;
}

vec3 distortion(vec2 uv, vec3 image) {
	vec2 d = uv.xy;    
	d.y += iResolution.y * -sin(iTime / 800.0);
	vec4 c = texture2D(noise, d);
    
    // pulse a composite mask
    float blur = map(-1.0, 1.0, 0.30, 0.5, sin(iTime * 4.0));
    
    // make the mask wave as function of uv.y
    uv.x += sin(uv.y * 10.0 + iTime * 6.0) * 0.01;
    
    // shift the mask up a bit
    uv.y -= 0.5;
    
    // taper start and end x components as a function of uv.y and taper attennuation
    float taper = 0.05;    
    float mask = bar(uv.x, -5.0 * -uv.y * taper, 5.0 * -uv.y * taper, blur / 5.0);
    
    //return vec3(mask); // for testing
	return mask * (image - vec3(c) * .2);
}

vec2 translate(vec2 uv, vec2 position){
  uv += position;
  return uv;
}

vec2 rotate(vec2 uv, float angle){
  float c = cos(angle);
  float s = sin(angle);
  mat2 mat = mat2(c,-s,s,c);
  // uv -= vec2(.5);
  uv *= mat;
  // uv += vec2(.5);
  return uv;
}

vec2 scale(vec2 uv, vec2 scale){
  mat2 mat = mat2(scale.x,.0,.0,scale.y);
  uv -= vec2(.5);
  uv *= mat;
  uv += vec2(.5);
  return uv;
}

void main() {
    vec2 uv = 1. - (gl_FragCoord.xy / iResolution.xy);
    uv -= 0.5;
    uv.x *= iResolution.x / iResolution.y;
    uv = scale(uv, vec2(1.,.3));
    // uv = translate(uv, vec2(-.2,.0));
    vec4 col = vec4(distortion(uv, fire(uv)), 1.0);
    col.a = col.r;
	gl_FragColor = col;
}
`;

const twistedShader =`

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;

uniform float radius;
uniform float angle;

vec2 twist(vec2 coord)
{
    coord -= iMouse/iResolution.xy;

    float dist = length(coord);

    if (dist < radius)
    {
        float ratioDist = (radius - dist) / radius;
        float angleMod = ratioDist * ratioDist * sin(iTime) * angle;
        float s = sin(angleMod);
        float c = cos(angleMod);
        coord = vec2(coord.x * c - coord.y * s, coord.x * s + coord.y * c);
    }

    coord += iMouse/iResolution.xy;

    return coord;
}

void main(void)
{

    vec2 coord = vTextureCoord;

    coord = twist(coord);

    gl_FragColor = texture2D(uSampler, coord );

}
`;

const shockwaveShader =`
precision mediump float;
const float PI = 3.1415926535;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;

vec2 translate(vec2 uv, vec2 position){
    uv += position;
    return uv;
}

vec2 rotate(vec2 uv, float angle){
    float c = cos(angle);
    float s = sin(angle);
    mat2 mat = mat2(c,-s,s,c);
    uv -= vec2(.5);
    uv *= mat;
    uv += vec2(.5);
    return uv;
}

vec2 scale(vec2 uv, vec2 scale){
    mat2 mat = mat2(scale.x,.0,.0,scale.y);
    uv -= vec2(.5);
    uv *= mat;
    uv += vec2(.5);
    return uv;
}

void main()
{
  vec2 uv = gl_FragCoord.xy/iResolution.xx;
  uv.y = 1. - uv.y;
  vec2 pos = iMouse;
  pos.y = 1. - pos.y;
  pos = pos * iResolution.xy; 
  
  float duration = 0.4;
  float time = mod(iTime, duration);
  float radius = 5000.* time*time;
  float thickness_ratio = 0.4;
  
  float time_ratio = time/duration;
   float shockwave = smoothstep(radius, radius-2.0, length(pos - gl_FragCoord.xy));
  shockwave *= smoothstep((radius-2.)*thickness_ratio, radius-2.0,length(pos - gl_FragCoord.xy));
  shockwave *= 1.-time_ratio;
  
  vec2 disp_dir = normalize(gl_FragCoord.xy-pos);
  
  
  uv += 0.02*disp_dir*shockwave;
  vec3 col = texture2D(uSampler, uv).rgb;
  
  
  gl_FragColor = vec4(col,1.0);
}`;

const transitionShader=
`
precision mediump float;
const float PI = 3.1415926535;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;
uniform vec2 transitionImage;

const float4 color

void main(){
    //glsl standard uv;
    vec2 uv = gl_FragCoord.xy/iResolution;

    //PIXI standard uv;
    uv = vTextureCoord;

    gl_FragColor = vec4(vec3(1.0),1.0);
}
`;

const limitVisionShader = `

precision mediump float;
const float PI = 3.1415926535;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform sampler2D uMap;

uniform vec4 filterArea;
uniform vec2 iMouse;
uniform float uRadius;

vec4 limitVision(vec2 st, vec2 pos, float radius){
  float pct = (1. - step(radius, distance(st,vec2(pos))));
  pct *= (1. - distance(st,pos)/radius);
  return vec4(pct);
}

void main(){
    //PIXI standard uv;
    vec2 uv = vTextureCoord;
    vec2 mouse = iMouse / filterArea.xy;
    vec4 col = limitVision(uv, mouse, uRadius);
    vec4 tex = texture2D(uMap,uv);
    vec4 result = mix(col,tex,col.a);
    gl_FragColor = result;
}
`;

const veryNoiceShader = `
const float PI = 3.1415926535;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform vec4 filterArea;
uniform float iTime;
uniform vec2 iMouse;

/// Over the mooooooooon

float Hash21(vec2 p){
    p = fract(p * vec2(234.45, 765.34));
    p += dot(p, p + 547.123);
    return fract(p.x * p.y);
}

float tapperBox(vec2 p, float wb, float wt, float yb, float yt, float blur){
    float m = smoothstep(-blur,blur,p.y - yb);
    m *= smoothstep(blur,-blur,p.y - yt);
    p.x = abs(p.x);
    // 0 p.y = yb, 1 p.y = yt;
    float w = mix(wb,wt,(p.y-yb) / (yt-yb));
    m *= smoothstep(blur, -blur, p.x-w);
    return m;
}

vec4 tree(vec2 uv ,vec3 col,float blur){
    float m = tapperBox(uv,.03,.03,-.05,.25, blur); //trunk
    m += tapperBox(uv,.2,.1,.25,.5,blur);
    m += tapperBox(uv,.15,.05,.5,.75,blur);
    m += tapperBox(uv,.1,.0,.75,1.,blur);

    float shadow = tapperBox(uv - vec2(.2,0.),.1,.5,.15,.25,blur);
    shadow += tapperBox(uv + vec2(0.25,0.),.1,.5,.45,.5,blur);
    shadow += tapperBox(uv - vec2(0.25,0.),.1,.5,.7,.75,blur);

    col -= shadow * .8;
    return vec4(col,m);
}

float getHeight(float x){
    return sin(x * .4213) + sin(x) * .3;
}

vec4 layer(vec2 uv, float blur){
    vec4 col = vec4(0.);

    float id = floor(uv.x);
    float n = fract(sin(id * 234.12) * 5463.3) * 2. - 1.;
    float x = n * 0.3;
    float y = getHeight(uv.x);

    float ground = smoothstep(blur, -blur, uv.y + y);
    col += ground;

    y = getHeight(id + .5 + x);
    uv.x = fract(uv.x) - .5;

    vec4 tree = tree((uv - vec2(x,-y)) * vec2(1,1. + n * .2),vec3(1), blur);   

    col = mix(col,tree,tree.a);
    col.a = max(ground,tree.a); 
    return col;
}

vec4 overTheMoon(){
    vec2 uv = (gl_FragCoord.xy - .5 * filterArea.xy)/ filterArea.y;
    vec2 M = (iMouse.xy/filterArea.xy) * 2. - 1.;
    float t = iTime * .3;
    float blur = .005;

    vec4 col = vec4(0.);

    float stars = Hash21(uv);
    float twinkle = dot(length(sin(uv + t)), length(cos(uv*vec2(22.,6.7) - t * 3.)));
    twinkle = sin(twinkle * 10.) * .5 + .5;
    col += pow(stars,100.) * twinkle;

    float moon = smoothstep(.01, -.01, length(uv - vec2(.5, .2)) - .15);
    col *= 1. - moon;
    moon *= smoothstep(-.01, .1, length(uv - vec2(.6, .25)) - .15);
    col += moon;

    vec4 layers;
    for(float i = 0.; i < 1.; i += 1./3.){
        float scale = mix(30.,1., i);
        blur = mix (.1,.005,i);
        layers = layer(uv * scale + vec2( t + i * 100.,i) - M,blur);
        layers.rgb *= (1. - i) * vec3(.9,.9,1.);
        col = mix(col,layers,layers.a);
    }
    layers = layer(uv + vec2(t,1.) - M, .02);
    col = mix(col, layers * .1, layers.a);
    return col;
}


//Over the moon end here

//Snow shaderrrr
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
            vec2 pos = .5 + .5 * cos(2. * PI * (iTime*.1 + hash(fl+offset)) + vec2(0,1.6));
            mindist = min(mindist, length(pos+offset -fr));
        }
    
    return mindist;
}

float blobnoise(vec2 v, float s)
{
    return pow(.5 + .5 * cos(PI * clamp(simplegridnoise(v)*2., 0., 1.)), s);
}

float fractalblobnoise(vec2 v, float s)
{
    float val = 0.;
    const float n = 4.;
    for(float i = 0.; i < n; i++)
        //val += 1.0 / (i + 1.0) * blobnoise((i + 1.0) * v + vec2(0.0, iTime * 1.0), s);
    	val += pow(0.5, i+1.) * blobnoise(exp2(i) * v + vec2(0, iTime), s);

    return val;
}

vec4 snow(vec2 uv){
    vec2 r = vec2(1., filterArea.y / filterArea.x);
    float val = fractalblobnoise(r * uv.xy * 5.,10.);
    return vec4(val);
}

void main(){
  vec2 uv = vTextureCoord;
  uv.y = 1. - uv.y;
  vec4 moon = overTheMoon();
  vec4 s = snow(uv);
  gl_FragColor = moon + s;
}
`