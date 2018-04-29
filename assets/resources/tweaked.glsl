#ifdef GL_ES
precision mediump float;
#endif
//tweaked by psyreco


uniform float time;
uniform vec2 resolution;
varying vec2 v_texCoord;
void main( void ) {

	vec2 rs = resolution.xy;
  	vec2 uv= v_texCoord.xy;
	vec2 position = abs( uv*rs * 2.0 -  rs) / min(resolution.x, resolution.y);
	vec3 destColor = vec3(.70, 0.0, .75 );
	float f = 0.45;
	
	for(float i = 0.5; i < 21.0; i++){
		
		float s = tan(sin(time/3.0 - i )) ;
		float c = atan(cos(time/7.0 - i ));
		f +=abs(0.0047 / abs(length(5.0* position *f - vec2(c, s) ) -0.84));
	}

	gl_FragColor = vec4(vec3(destColor * f) + vec3(destColor.yzx * f/2.0), 1.0);
}

