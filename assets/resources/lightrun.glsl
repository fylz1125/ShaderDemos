/*
  Daily an hour GLSL sketch by @chimanaco 3/30

  References:
  http://tokyodemofest.jp/2014/7lines/index.html
*/

#ifdef GL_ES
precision mediump float;
#endif

#define PI  3.1415926535

uniform float time;
uniform vec2 resolution;
varying vec2 v_texCoord;

void main( void ) {
  // 换成resolution
  vec2 rs = resolution.xy;
  vec2 uv= v_texCoord.xy;
  // 换成纹理坐标v_texCoord.xy
  // vec2 p=(gl_FragCoord.xy -.5 * resolution.xy)/ min(resolution.x,resolution.y);
  vec2 p=(uv * rs - .5 * rs) /  min(resolution.x,resolution.y);

  vec3 c = vec3(0);
  
  for(int i = 0; i < 10; i++){
  float f=2.* PI * float(i) / 20. ;
  float t =  mod(time,1.0/( 1.0*9.0 /20.0));
  //float x = cos(t) * sin(t);
  float x = -cos(t*f);
  float y = -sin(t*f);
  vec2 o = 0.4 * vec2(x,y);
    
  float r = fract(t*f);
  float g = 1.-r;
  float b = 1.-r;
  c += 0.005/(length(p-o))*vec3(r,g,1);
  }
  gl_FragColor = vec4(c,1.);
}