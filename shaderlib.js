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

vec3 circle(vec2 st, vec2 pos, float radius){
  float pct = 1. - step(radius,distance(st,vec2(pos)));

  return vec3(pct);
}

void main() {
  // Screen UVs
  // vec2 st = gl_FragCoord.xy / iResolution;
  //Built-in UVs
  vec2 st = vTextureCoord;
  vec3 color = vec3(0.);
  for(float i = 0.0; i < 1.; i+=0.01){
    vec3 circ = circle(st,(vec2(i, 0.5 + ((sin(iTime * i)))/2.)),0.01);
    circ *= (vec3(1.0,0.5,0.8));
    color += circ; 
  }

  // vec3 color = rectangle(st, vec2(0.25,0.25), 0.5);
  gl_FragColor = vec4(color,1.);
}
`;

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

uniform vec3 iResolution;
uniform float iTime;

void main()
{
    T = iTime;

    vec2 r = vec2(1.0, iResolution.y / iResolution.x);
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

uniform vec3 iResolution;
uniform float iTime;

float noise(vec3 p)
{
	vec3 i = floor(p);
	vec4 a = dot(i, vec3(1., 57., 21.)) + vec4(0., 57., 21., 78.);
	vec3 f = cos((p-i)*acos(-1.))*(-.5)+.5;
	a = mix(sin(cos(a)*a),sin(cos(1.+a)*(1.+a)), f.x);
	a.xy = mix(a.xz, a.yw, f.y);
	return mix(a.x, a.y, f.z);
}

float sphere(vec3 p, vec4 spr)
{
	return length(spr.xyz-p) - spr.w;
}

float flame(vec3 p)
{
	float d = sphere(p*vec3(1.,.5,1.), vec4(.0,-1.,.0,1.));
	return d + (noise(p+vec3(.0,iTime*2.,.0)) + noise(p*3.)*.5)*.25*(p.y) ;
}

float scene(vec3 p)
{
	return min(100.-length(p) , abs(flame(p)) );
}

vec4 raymarch(vec3 org, vec3 dir)
{
	float d = 0.0, glow = 0.0, eps = 0.02;
	vec3  p = org;
	bool glowed = false;
	
	for(int i=0; i<64; i++)
	{
		d = scene(p) + eps;
		p += d * dir;
		if( d>eps )
		{
			if(flame(p) < .0)
				glowed=true;
			if(glowed)
       			glow = float(i)/64.;
		}
	}
	return vec4(p,glow);
}

void main()
{
	vec2 v = -1.0 + 2.0 * vTextureCoord;
	v.x *= iResolution.x/iResolution.y;
	
	vec3 org = vec3(0., -2., 4.);
	vec3 dir = normalize(vec3(v.x*1.6, v.y, -1.5));
	
	vec4 p = raymarch(org, dir);
	float glow = p.w;
	
	vec4 col = mix(vec4(1.,.5,.1,1.), vec4(0.1,.5,1.,1.), p.y*.02+.4);
	
	gl_FragColor = mix(vec4(0.), col, pow(glow*2.,4.));
}
`;