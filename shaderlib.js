const templateShaderCode =`
const float PI = 3.1415926535;
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec2 iResolution;
uniform float uTime;
uniform vec2 uPosition;
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
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec2 iResolution;
uniform float uTime;
uniform vec2 uPosition;
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
  // st = rotate(st, uTime);
  // res = rotate(res,abs(sin(uTime)));
  color += circle(st, vec2(.5,.5),.2);
  // vec3 color = rectangle(st, vec2(0.25,0.25), 0.5 * iResolution.y / iResolution.x);
  gl_FragColor = vec4(color,1.);
}
`;

const inverseColorShader = `
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec3 iResolution;
uniform float uTime;
void main(){
  gl_FragColor = texture2D(uSampler, vTextureCoord);
  gl_FragColor.rgb  = 1.0 - gl_FragColor.rgb;
}`

//https://www.shadertoy.com/view/3lBSR3
const pixelateShader = `
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec3 iResolution;
uniform float uTime;
uniform float amount;
void main(){
  vec2 uv = vTextureCoord;
  vec2 c = mix(iResolution.xy, vec2(4), amount);
  uv = floor(uv * c) / c;
  gl_FragColor = texture2D(uSampler, uv);
}`

//https://www.shadertoy.com/view/XsGBzW
const shinyShader = `
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float uTime;
void main() {
  vec2 r = vTextureCoord;
  float col = sin(-r.y + r.x - uTime * 5.) * 0.9;
  col *= col * col * 0.6;
  col = clamp(col,0.,1.);
  vec4 text = texture2D(uSampler, r);
  gl_FragColor = text + vec4(col);
}
`

const silexarsShader = `
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec3 iResolution;
uniform float uTime;
void main() {
  vec2 uv = vTextureCoord;
  vec3 wave_color = vec3(0.0);
  float wave_width = 0.0;
  uv = -3. + 2. * uv;
  uv.y += 0.;
  for(float i = 0.; i <= 28.; i++){
    uv.y += (0.2+(0.9*sin(uTime*0.4) * sin(uv.x + i/3.0 + 3.0 *uTime )));
    uv.x += 1.7* sin(uTime*0.4);
    wave_width = abs(1.0 / (200.0*abs(cos(uTime)) * uv.y));
    wave_color += vec3(wave_width *( 0.4+((i+1.0)/18.0)), wave_width * (i / 9.0), wave_width * ((i+1.0)/ 8.0) * 1.9);
  }
  vec4 newCol = vec4(wave_color,1.);
  vec4 text = texture2D(uSampler, vTextureCoord);
  gl_FragColor = newCol;
}`

//https://www.shadertoy.com/view/XsXXDn
const silexars2Shader = `
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec4 filterArea;
uniform vec2 dimensions;
uniform float uTime;
void main() {
  vec3 c;
	float l,z=uTime;
	for(int i=0;i<3;i++) {
    vec2 uv,p=vTextureCoord * filterArea.xy/dimensions;
		uv=p;
		p-=vec2(.5,.5)˜ n ;
		z+=.07;
		l=length(p);
		uv+=p/l*(sin(z)+1.)*abs(sin(l*9.-z*2.));
		c[i]=.01/length(abs(mod(uv,1.)-.5));
	}
  vec4 newCol =vec4(c/l,uTime);
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
uniform float uTime;
void main(){
  vec2 uv = vTextureCoord;
	float amount = 0.0;
	
	amount = (1.0 + sin(uTime*6.0)) * 0.5;
	amount *= 1.0 + sin(uTime*16.0) * 0.5;
	amount *= 1.0 + sin(uTime*19.0) * 0.5;
	amount *= 1.0 + sin(uTime*27.0) * 0.5;
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
        //val += 1.0 / (i + 1.0) * blobnoise((i + 1.0) * v + vec2(0.0, uTime * 1.0), s);
    	val += pow(0.5, i+1.) * blobnoise(exp2(i) * v + vec2(0, T), s);
    return val;
}
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float uTime;
uniform vec4 filterArea;
void main()
{
    T = uTime;
    vec2 r = vec2(1.0, filterArea.y / filterArea.x);
	  vec2 uv = vTextureCoord;
    float val = fractalblobnoise(r * uv.yx * 50.0, 5.0);
    gl_FragColor = mix(texture2D(uSampler, uv), vec4(1.0), vec4(val));
}
`;

//https://www.shadertoy.com/view/MdX3zr
const flameShader = `
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform sampler2D noise;
uniform vec3 iResolution;
uniform float uTime;
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
    float m = sin(y * 10.0 + uTime * 6.0) * 0.01;
    float x = uv.x - m;
    
    vec3 mask = blurredBar(vec2(x, y), vec2(start, end), vec2(maxblur, minblur), vec3(1.0, 1.0, 0.0)) +
        blurredBar(vec2(x, y), vec2(start-0.1, end+0.1), vec2(maxblur+0.2, minblur-0.2), vec3(1.0, 0.0, 0.0));
    
    vec3 fade = vec3(0.5) - y;
    
    return mask * fade;
}
vec3 distortion(vec2 uv, vec3 image) {
	vec2 d = uv.xy;    
	d.y += iResolution.y * -sin(uTime / 800.0);
	vec4 c = texture2D(noise, d);
    
    // pulse a composite mask
    float blur = map(-1.0, 1.0, 0.30, 0.5, sin(uTime * 4.0));
    
    // make the mask wave as function of uv.y
    uv.x += sin(uv.y * 10.0 + uTime * 6.0) * 0.01;
    
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
uniform vec4 filterArea;
uniform float uTime;
uniform vec2 uPosition;
uniform float uRadius;
uniform float uAngle;
vec2 twist(vec2 coord)
{
    coord -= uPosition/filterArea.xy;
    float dist = length(coord);
    if (dist < uRadius)
    {
        float ratioDist = (uRadius - dist) / uRadius;
        float angleMod = ratioDist * ratioDist * sin(uTime) * uAngle;
        float s = sin(angleMod);
        float c = cos(angleMod);
        coord = vec2(coord.x * c - coord.y * s, coord.x * s + coord.y * c);
    }
    coord += uPosition/filterArea.xy;
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
const float PI = 3.1415926535;
varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform float uTime;
uniform vec2 uPosition;

uniform vec4 filterArea;
uniform vec4 filterClamp;

void main()
{
  vec2 uv = vTextureCoord;
  vec2 pos = uPosition;
  
  float duration = 5.;
  float time = mod(uTime, duration);
  float radius = 100.* time;
  float thickness_ratio = 0.4;
  
  float time_ratio = time/duration;
  vec2 st = uv * filterArea.xy;
  float shockwave = smoothstep(radius, radius-2.0, length(pos - st));
  shockwave *= smoothstep((radius-2.)*thickness_ratio, radius-2.0,length(pos - st));
  shockwave *= 1.-time_ratio;
  
  vec2 disp_dir = normalize((st * filterArea.xy)-pos);
  
  
  uv += 0.02*disp_dir*shockwave;

  vec2 unmappedCoord = uv / filterArea.xy;
  vec2 clampedCoord = clamp(unmappedCoord, filterClamp.xy, filterClamp.zw);

  vec3 col = texture2D(uSampler, uv).rgb;
  
  
  gl_FragColor = vec4(col,1.0);
}`;

const transitionShader=
`
const float PI = 3.1415926535;
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec2 iResolution;
uniform float uTime;
uniform vec2 uPosition;
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
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec4 filterArea;

uniform vec2 uPosition;
uniform float uRadius;

vec4 limitVision(vec2 st, vec2 pos, float radius){
  float pct = (1. - step(radius, distance(st,vec2(pos)))) * (1. - smoothstep(0., radius ,distance(st,vec2(pos))));
  return vec4(1./pct);
}
void main(){
    //PIXI standard uv;
    vec2 uv = vTextureCoord;
    vec4 col = limitVision(uv, vec2(uPosition/filterArea.xy), uRadius);
    vec4 tex = texture2D(uSampler,uv);
    vec4 result = mix(col,tex,col.a);
    gl_FragColor = result;
}
`;

const displacementShader = `
varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform sampler2D mapSampler;
uniform float uTime;

vec2 displacement(vec2 disp, float strength){   
  disp = ((disp * 2.) - 1.) * strength * (sin(uTime) + 1.) / 2.;
  return disp;
}

void main(){
  vec4 disp = texture2D(mapSampler, vTextureCoord);
  gl_FragColor = texture2D(uSampler,vTextureCoord + displacement(disp.xy, 0.05));
}
`

const nocturnalVision = `
varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform sampler2D mapSampler;

uniform vec4 filterArea;
uniform vec4 filterClamp;

uniform vec2 dimensions;

uniform float uTime;
uniform vec2 uPosition;
uniform float uRadius;

mat2 rotate(float angle){
  return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

vec2 translate(vec2 uv, vec2 value){
  uv += value;
  return uv;
}

vec4 limitVision(vec2 st, vec2 pos, float radius){
  float pct = (1. - step(radius ,distance(st,vec2(pos))));
  pct *= (1. - distance(st,pos)/radius);
  return vec4(1. - pct);
}

void main(){
  vec2 st = vTextureCoord;
  vec4 col = limitVision(st, uPosition/filterArea.xy, uRadius);
  vec4 tex = texture2D(uSampler,st);
  vec4 result = mix(col,tex,col.a);
  st *= filterArea.xy/dimensions;
  st -= .5;
  st *= rotate(-uTime/15.);
  st += .5;
  vec4 tex2 = texture2D(mapSampler,(st)* col.a);
  tex2/=5.;
  result = mix(tex,tex2,col.a);
  gl_FragColor = result;
}
`