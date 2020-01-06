#ifdef GL_ES
precision mediump float;
#endif

#define pi 3.1415926


uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

uniform sampler2D u_tex0;
uniform sampler2D u_tex1;

const int AMOUNT = 5;
const float MAGNITUDE = -2.;
const bool _Distort = true;
const float _Cutoff = .5;
const float _Fade = 1.;

float circleShape(vec2 position, float radius){
    return step(radius, length(position - vec2(.5,.5)));
}

float rectangleShape(vec2 position, vec2 scale){
    scale = vec2(0.5) - scale * 0.5;
    vec2 shaper = vec2(step(scale.x, position.x), step(scale.y, position.y));
    shaper *= vec2(step(scale.x, 1.0 - position.x), step(scale.y, 1.0 - position.y));
    return shaper.x * shaper.y;
}

mat2 rotate(float angle){
    return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

mat2 scale(vec2 scale){
    return mat2(scale.x, 0.0, 0.0, scale.y);
}

vec2 translate(vec2 uv, vec2 value){
    uv += value;
    return uv;
}

vec3 fancyColor(vec2 uv){
    uv *= 5.;
    float x = 0.;
    float y = 0.;
     for(int n = 1; n < 8; n++){
        float i = float(n);
        x = .7 / i * sin(i * uv.y + u_time + .3 * i) + .8;
        y = .4 / i * sin(uv.x + u_time + .3 * i )+ 1.6;
        uv += vec2(x,y);
    }
    return vec3(.5 * sin(uv.x) + .5, .5 * sin(uv.y) + .5, sin(uv.x + uv.y));
}

vec3 fancyColor2(vec2 uv){
    uv = 20. * (gl_FragCoord.xy - u_resolution / 2.)/min(u_resolution.y, u_resolution.x);
    float len;
    vec3 col = vec3(0.);
    for(int i = 0; i < AMOUNT; i++){
        len = length(vec2(uv.x,uv.y));
        uv.x = uv.x - cos(uv.y + sin(len)) + cos(u_time / 9.);
        uv.y = uv.y + sin(uv.x + cos(len)) + sin(u_time/12.);
    }

    col = vec3(cos(len * 2.), cos(len * 3.), cos(len * 1.5));
    return col;
}

vec3 fancyColor3(vec2 uv){
    float color = 0.;

    color += sin(uv.x * 50. + cos(u_time + uv.y * 10. + sin(uv.x * 50. + u_time * 5.))) * 2.;
    color += cos(uv.x * 30. + sin(u_time + uv.y * 10. + cos(uv.x * 50. + u_time * 5.))) * 2.;
    color += sin(uv.x * 30. + cos(u_time + uv.y * 10. + sin(uv.x * 50. + u_time * 5.))) * 2.;    
    color += cos(uv.x * 10. + sin(u_time + uv.y * 10. + cos(uv.x * 50. + u_time * 5.))) * 2.;
    return vec3(color + uv.y * 2.,color + uv.y,color * 2.);
}

vec3 fancyColor4(vec2 uv){
    float col = 0.;
    col += sin(uv.x * 6. + sin(u_time + uv.y * 90. + cos(uv.x * 30. + u_time * 2.))) * .5;
    return vec3(col + uv.x,col + uv.x,col);
}

vec3 rainbowSwirl(vec2 uv){
    vec3 color = vec3(0.);
    vec2 pos = vec2(.9,.5);
    float angle = atan(-uv.y + pos.y, uv.x - pos.x) * .1;
    float len = length(uv - vec2(pos.x, pos.y));

    color.r += sin(len * 50. + angle * 40. + u_time);
    color.g += cos(len * 30. + angle * 60. - u_time);
    color.b += sin(len * 50. + angle * 50. + 3.);

    return vec3(color);
}

vec3 sanningLines(vec2 uv){
    vec3 color = vec3(0.);
    float size = 6.;
    float alpha = sin(floor(uv.x * size) + u_time * 4.);
    return vec3(alpha);
}

vec3 movingLight(vec2 uv){
    float color = 0.;
    uv = (gl_FragCoord.xy * 2. - u_resolution) / min(u_resolution.x, u_resolution.y);

    uv.x += sin(u_time) + cos(u_time * 2.1);
    uv.y += cos(u_time) + sin(u_time * 1.6);

    color += .1 * (abs(sin(u_time)) + .1) / length(uv);
    return vec3(color);
}

vec3 lighCircle(vec2 uv, int amount){
    uv = gl_FragCoord.xy / u_resolution;
    uv = translate(uv, vec2(-.5));
    float color = 0.;
    for(int i = 0; i < amount; i++){
        float radius = 0.3;
        float rad = radians(360. / float(amount)) * float(i);
        color += 0.1 / float(amount) / length(uv + vec2(radius * cos(rad), radius * sin(rad)));        
    }    
    return vec3(color);
}

vec3 gridBox(){
    vec2 uv = gl_FragCoord.xy * 1. - u_resolution;
    float color = 0.;
    color += abs(cos(uv.x / 10.) + sin (uv.y / 10.) - cos(u_time));
    return vec3(color);
}

float random2d(vec2 coord){
    return fract(sin(dot(coord.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

vec3 morphGrid(){
    vec2 uv = gl_FragCoord.xy * .01;
    uv -= u_time + vec2(sin(uv.y), sin(uv.x));

    float rand01 = fract(random2d(floor(uv)) + u_time / 60.);
    float rand02 = fract(random2d(floor(uv)) + u_time / 40.);

    rand01 *= 0.4  - length(fract(uv));

    return vec3(rand01 * 4., rand02 * rand01 * 4.,0.);
}

float noise1d(float v){
    return cos(v + cos(v * 90.1415) * 100.1415) * 0.5 + 0.5;
}

vec3 circleColorPulse(vec2 uv){
    vec3 color = vec3(0.);
    uv = translate(uv, vec2(-.5));
    color.r += abs(.1 + length(uv) - .6 * abs(sin(u_time * .9/ 6.)));
    color.g += abs(.1 + length(uv) - .6 * abs(sin(u_time * .6/ 2.)));
    color.b += abs(.1 + length(uv) - .6 * abs(sin(u_time * .3/ 4.5)));
    return .1/color;
}

float size = 6.;
float speed = -10.;
bool flip = false;

vec4 scanImage(vec2 uv, vec4 image){
    if(flip){
        image.a = sin(floor(uv.x * size) - u_time * speed);
    } else {
        image.a = sin(floor(uv.y * size) - u_time * speed);
    }
    return image;
}

vec3 textureGrayGrain(vec2 uv,vec3 image){
    float noise = (random2d(uv * u_time)-.5);
    
    float value = (image.r + image.g + image.b)/3.;
    image.rgb = vec3(value);
    image.rgb += vec3(noise);
    return image.rgb;
}

vec2 displacement(vec2 disp, float strength){   
    disp = ((disp * 2.) - 1.) * strength * (sin(u_time) + 1.) / 2.;
    return disp;
}

float N21(vec2 p){
    p = fract(p * vec2(123.34,345.45));
    p += dot(p, p + 1.345);
    return fract(p.x * p.y);
}

vec2 rainyRainbow(vec2 st){

    float t = mod(u_time,7200.);

    vec3 col = vec3(0.);

    vec2 aspect = vec2(3.,2.);
    vec2 uv = st * float(AMOUNT) * aspect;

    uv.y += t * .25;

    vec2 gv = fract(uv)-.5;
    vec2 id = floor(uv);

    float n = N21(id);
    t += n * 2. * 3.1415926535;

    float w = st.y * 10.;
    float x = (n-.5) * .8; // -.4 .4;
    x += (.4 - abs(x)) *  sin(3. * w) * pow(sin(w), 6.) * .45;

    float y = -sin(t + sin(t + sin(t) * .5)) * .45;
    y -= (gv.x - x) * (gv.x-x);

    vec2 dropPos = (gv-vec2(x,y))/aspect;
    float drop = smoothstep(.05,.03,length(dropPos));

    vec2 trailPos = (gv - vec2(x, t * .25)) / aspect;
    trailPos.y = (fract(trailPos.y * 8.) - .5) / 8.;
    float trail = smoothstep(.03, .01, length(trailPos));

    float fogTrail = smoothstep(-.05,.05,dropPos.y);
    fogTrail *= smoothstep(.5, y, gv.y);
    trail *= fogTrail;
    fogTrail *= smoothstep(.05, .04, abs(dropPos.x));

    col += fogTrail;
    col += trail;
    col += drop;

    return drop * dropPos + trail * trailPos;
    //vec4 img = texture2D(u_tex0, st + offSet * MAGNITUDE); off set here for color
}

vec4 transition(vec2 uv){
    vec4 transit = texture2D(u_tex1, uv);
    vec2 direction = vec2(0.);
    if(_Distort){
        direction = normalize(vec2((transit.r - .5) * 2. , (transit.g - .5)* 2.));
    }
    float cutOff = ((sin(u_time) + 1.) / 2.);
    vec4 col = texture2D(u_tex0, uv);
    if(transit.b < cutOff){
        return col = mix(col, vec4(0.8549, 0.0314, 0.0314, 1.0), _Fade);
    }
    return col;
}

vec4 limitVision(vec2 st, vec2 pos, float radius){
  pos.x *= u_resolution.x/u_resolution.y;
  st.x *= u_resolution.x/u_resolution.y;
  float pct = (1. - step(radius ,distance(st,vec2(pos))));
  pct *= (1. - distance(st,pos)/radius);
  return vec4(pct);
}

float lum(vec3 c){
    return (c.x + c.y + c.z)/3.;
}

vec4 normalMap(vec2 uv, sampler2D texture){
    vec2 texelsize = 1./u_resolution.xy;
    float dx = 0.;
    float dy = 0.;

    dx -= lum(texture2D(texture, vec2(uv.x - texelsize.x, uv.y - texelsize.y)).rgb) * 1.0;
	dx -= lum(texture2D(texture, vec2(uv.x - texelsize.x, uv.y              )).rgb) * 2.0;
	dx -= lum(texture2D(texture, vec2(uv.x - texelsize.x, uv.y + texelsize.y)).rgb) * 1.0;
	dx += lum(texture2D(texture, vec2(uv.x + texelsize.x, uv.y - texelsize.y)).rgb) * 1.0;
	dx += lum(texture2D(texture, vec2(uv.x + texelsize.x, uv.y              )).rgb) * 2.0;
	dx += lum(texture2D(texture, vec2(uv.x + texelsize.x, uv.y + texelsize.y)).rgb) * 1.0;
    
    dy -= lum(texture2D(texture, vec2(uv.x - texelsize.x, uv.y - texelsize.y)).rgb) * 1.0;
	dy -= lum(texture2D(texture, vec2(uv.x              , uv.y - texelsize.y)).rgb) * 2.0;
	dy -= lum(texture2D(texture, vec2(uv.x + texelsize.x, uv.y - texelsize.y)).rgb) * 1.0;
	dy += lum(texture2D(texture, vec2(uv.x - texelsize.x, uv.y + texelsize.y)).rgb) * 1.0;
	dy += lum(texture2D(texture, vec2(uv.x              , uv.y + texelsize.y)).rgb) * 2.0;
	dy += lum(texture2D(texture, vec2(uv.x + texelsize.x, uv.y + texelsize.y)).rgb) * 1.0;
    float nx = dx;
    float ny = dy;
    
    vec3 norm = vec3(nx,
                     ny,
                    sqrt(1.0 - nx*nx - ny*ny));
    
    return vec4(norm * vec3(0.5, 0.5, 1.0) + vec3(0.5, 0.5, 0.0), 1.0);
}

vec4 normalMap2(vec2 uv, sampler2D texture){
    float x=1.;
	float y=1.;
	
	float M =abs(texture2D(texture, uv + vec2(0., 0.)/ u_resolution.xy).r); 
	float L =abs(texture2D(texture, uv + vec2(x, 0.)/ u_resolution.xy).r);
	float R =abs(texture2D(texture, uv + vec2(-x, 0.)/ u_resolution.xy).r);	
	float U =abs(texture2D(texture, uv + vec2(0., y)/ u_resolution.xy).r);
	float D =abs(texture2D(texture, uv + vec2(0., -y)/ u_resolution.xy).r);
	float X = ((R-M)+(M-L))*.5;
	float Y = ((D-M)+(M-U))*.5;
	
	float strength =.01;
	vec4 N = vec4(normalize(vec3(X, Y, strength)), 1.0);

	vec4 col = vec4(N.xyz * 0.5 + 0.5,1.);
    return col;
}

vec3 lightSource(vec2 pos, float size){
    return vec3(pos,size);
}

vec4 lightWNormal(vec2 uv, sampler2D texture){
    vec3 light = lightSource(u_mouse/u_resolution.yx, .5);
    vec4 color = texture2D(texture,uv);
    float dist = distance(uv, light.xy);
    vec4 map = normalMap2(uv, texture);
    vec3 normalVector = normalize(map.xyz);
    normalVector = texture2D(u_tex1, uv).xyz;
    vec3 lightVector = normalize(vec3(light.x - uv.x, light.y - uv.y, light.z));
    float diffuse = 1. * max(dot(normalVector, lightVector),0.);
    vec4 result = step(dist, light.z) * (color * (1. - dist/light.z));
    return result * diffuse;
}

vec2 twist(vec2 coord, float radius, float angle)
{
    coord -= u_mouse/u_resolution.xy;

    float dist = length(coord);

    if (dist < radius)
    {
        float ratioDist = (radius - dist) / radius;
        float angleMod = ratioDist * ratioDist * angle;
        float s = sin(angleMod);
        float c = cos(angleMod);
        coord = vec2(coord.x * c - coord.y * s, coord.x * s + coord.y * c);
    }

    coord += u_mouse/u_resolution.xy;

    return coord;
}

vec4 norctunalVision(){
    vec2 st = gl_FragCoord.xy / u_resolution.xy;    
    vec4 col = limitVision(st, u_mouse/u_resolution.xy, .5);
    
    vec4 tex = texture2D(u_tex0,st);
    vec4 result = mix(col,tex,col.a);
    st = twist(st, 1., 2.);
    vec4 tex2 = texture2D(u_tex1,st);
    tex2.rgb /= 5.;
    result = mix(result,tex2,1. - col.a);
    return result;
}

vec4 gradientTemplate(vec2 st){
    vec4 col1 = vec4(1.,0.,0.,1.);
    vec4 col2 = vec4(0.9255, 0.4706, 0.0471, 1.0);
    vec4 col3 = vec4(0.9882, 0.8667, 0.1961, 1.0);
    vec4 col = mix(col1, col2,smoothstep(0., .25, st.y));
    col = mix(col,col3,smoothstep(0.25, .5, st.y));
    col = mix(col, vec4(0.8157, 1.0, 0.0, 1.0), smoothstep(0.5, .75, st.y));
    col = mix(col, vec4(0.5529, 1.0, 0.0392, 1.0),smoothstep(.75, 1., st.y));
    return col;
}

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
    vec2 uv = (gl_FragCoord.xy - .5 * u_resolution.xy)/ u_resolution.y;
    vec2 M = (u_mouse.xy/u_resolution.xy) * 2. - 1.;
    float t = u_time * .3;
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
    for(float i = 0.; i < 1.; i += 1./5.){
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
            vec2 pos = .5 + .5 * cos(2. * pi * (u_time*.1 + hash(fl+offset)) + vec2(0,1.6));
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
    	val += pow(0.5, i+1.) * blobnoise(exp2(i) * v + vec2(0, u_time), s);

    return val;
}

vec4 snow(){
    vec2 r = vec2(1., u_resolution.y / u_resolution.x);
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float val = fractalblobnoise(r * uv.xy * 5.,10.);
    return vec4(val);
}

// Snow end here


void main(){
    //glsl standard uv;
    // vec2 st = gl_FragCoord.xy / u_resolution.xy;    
    // vec2 uv = twist(st,.5, 1.);
    // vec2 disp = rainyRainbow(st);
    // vec4 result = texture2D(u_tex0, uv + disp);
    // vec4 img = texture2D(u_tex0, st + disp * MAGNITUDE);
    vec4 moon = overTheMoon();
    vec4 s = snow();
    gl_FragColor = moon + s;
}

///////
    // vec2 disp = displacement(texture2D(u_tex1,st).rg);
    // vec4 col = limitVision(st, u_mouse/u_resolution.xy, 1.5);
    // vec4 tex = texture2D(u_tex0,st + disp);
    // vec4 result = mix(col,tex,col.a);
    // st -= .5;
    // st *= rotate((sin(u_time)+ 1. /2.));
    // st += .5;
    // st = translate(st, u_mouse/u_resolution.xy);
    // vec4 tex2 = texture2D(u_tex1,st * col.a);
    // result = mix(tex2,result,col.a);
///////