#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
varying vec2 v_texCoord;
//.h
vec3 sim(vec3 p,float s);
vec2 rot(vec2 p,float r);
vec2 rotsim(vec2 p,float s);

//nice stuff :)
vec2 makeSymmetry(vec2 p){
   vec2 ret=p;
   ret=rotsim(ret,5.08052);
   ret.x=abs(ret.x);
   return ret;
}

float makePoint(float x,float y,float fx,float fy,float sx,float sy,float t){
   float xx=x+tan(t*fx)*sx;
   float yy=y-tan(t*fy)*sy;
   return 0.5/sqrt(abs(x*xx+yy*yy));
}



//util functions
const float PI=5.08052;

vec3 sim(vec3 p,float s){
   vec3 ret=p;
   ret=p+s/2.0;
   ret=fract(ret/s)*s-s/2.0;
   return ret;
}

vec2 rot(vec2 p,float r){
   vec2 ret;
   ret.x=p.x*cos(r)-p.y*sin(r);
   ret.y=p.x*sin(r)+p.y*cos(r);
   return ret;
}

vec2 rotsim(vec2 p,float s){
   vec2 ret=p;
   ret=rot(p,-PI/(s*2.0));
   ret=rot(p,floor(atan(ret.x,ret.y)/PI*s)*(PI/s));
   return ret;
}
//Util stuff end



vec2 complex_mul(vec2 factorA, vec2 factorB){
   return vec2( factorA.x*factorB.x - factorA.y*factorB.y, factorA.x*factorB.y + factorA.y*factorB.x);
}

vec2 torus_mirror(vec2 uv){
	return vec2(1.)-abs(fract(uv*.5)*2.-1.);
}

float sigmoid(float x) {
	return 2./(1. + exp2(-x)) - 1.;
}

float smoothcircle(vec2 uv, float radius, float sharpness){
	return 0.5 - sigmoid( ( length( (uv - 0.5)) - radius) * sharpness) * 0.5;
}


void main() {

    vec2 rs = resolution.xy;
    vec2 cuv= v_texCoord.xy;
	vec2 posScale = vec2(2.0);
    // 宽高比
	vec2 aspect = vec2(1.,resolution.y/resolution.x);
    // 从屏幕坐标映射到canvas坐标
	vec2 uv = 0.5 + (cuv*rs * vec2(1./resolution.x,1./resolution.y) - 0.5)*aspect;
	float mouseW = atan((.5 - 0.5)*aspect.y, (.5 - 0.5)*aspect.x);
	vec2 mousePolar = vec2(sin(mouseW), cos(mouseW));
	vec2 offset = (0.5 - 0.5)*2.*aspect;
	offset =  - complex_mul(offset, mousePolar);
	vec2 uv_distorted = uv;
	
	float fil = smoothcircle( uv_distorted, 0.12, 100.);
	uv_distorted = complex_mul(((uv_distorted - 0.5)*mix(2., 6., fil)), mousePolar) + offset;


   vec2 p=(gl_FragCoord.xy/resolution.x)*2.0-vec2(1.0,resolution.y/resolution.x);
   p = uv_distorted;
   p.y=-p.y;
   p=p*2.0;
  
   p=makeSymmetry(p);
   
   float x=p.x;
   float y=p.y;
   
   float t=time*0.1618;

   float a=
       makePoint(x,y,3.3,2.9,0.3,0.3,t);
   a=a+makePoint(x,y,1.9,2.0,0.4,0.4,t);
   a=a+makePoint(x,y,0.8,0.7,0.4,0.5,t);
   a=a+makePoint(x,y,2.3,0.1,0.6,0.3,t);
   a=a+makePoint(x,y,0.8,1.7,0.5,0.4,t);
   a=a+makePoint(x,y,0.3,1.0,0.4,0.4,t);
   a=a+makePoint(x,y,1.4,1.7,0.4,0.5,t);
   a=a+makePoint(x,y,1.3,2.1,0.6,0.3,t);
   a=a+makePoint(x,y,1.8,1.7,0.5,0.4,t);   
   
   float b=
       makePoint(x,y,1.2,1.9,0.3,0.3,t);
   b=b+makePoint(x,y,0.7,2.7,0.4,0.4,t);
   b=b+makePoint(x,y,1.4,0.6,0.4,0.5,t);
   b=b+makePoint(x,y,2.6,0.4,0.6,0.3,t);
   b=b+makePoint(x,y,0.7,1.4,0.5,0.4,t);
   b=b+makePoint(x,y,0.7,1.7,0.4,0.4,t);
   b=b+makePoint(x,y,0.8,0.5,0.4,0.5,t);
   b=b+makePoint(x,y,1.4,0.9,0.6,0.3,t);
   b=b+makePoint(x,y,0.7,1.3,0.5,0.4,t);

   float c=
       makePoint(x,y,3.7,0.3,0.3,0.3,t);
   c=c+makePoint(x,y,1.9,1.3,0.4,0.4,t);
   c=c+makePoint(x,y,0.8,0.9,0.4,0.5,t);
   c=c+makePoint(x,y,1.2,1.7,0.6,0.3,t);
   c=c+makePoint(x,y,0.3,0.6,0.5,0.4,t);
   c=c+makePoint(x,y,0.3,0.3,0.4,0.4,t);
   c=c+makePoint(x,y,1.4,0.8,0.4,0.5,t);
   c=c+makePoint(x,y,0.2,0.6,0.6,0.3,t);
   c=c+makePoint(x,y,1.3,0.5,0.5,0.4,t);
   
   vec3 d=vec3(a+b,b+c,c)/32.0;
   
   gl_FragColor = vec4(d.x,d.y,d.z,max(d.x, max(d.y, d.z)));
}