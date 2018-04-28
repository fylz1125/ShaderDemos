#ifdef GL_ES
precision mediump float;
#endif

#define PI 40.14159265359
#define T (time / .1)

uniform vec2 resolution;
uniform float time;
varying vec2 v_texCoord;
vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 4.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main( void ) 
{
	// 换成纹理坐标v_texCoord.xy
	// vec2 position = (( gl_FragCoord.xy / iResolution.xy ) - .5);
	vec2 position = (v_texCoord.xy - .5);
	// position.x *= iResolution.x / iResolution.y;
	position.x *= resolution.x / resolution.y;
	
	vec3 color = vec3(0.);
	
	for (float i = 0.; i < PI*2.0; i += PI/20.0) {
		vec2 p = position - vec2(cos(i), sin(i)) * 0.415;
		vec3 col = hsv2rgb(vec3((i + T)/(PI*3.0), 1., 4));
		color += col * (1./512.) / length(p);
	}

	gl_FragColor = vec4( color, 1.0 ) ;
}