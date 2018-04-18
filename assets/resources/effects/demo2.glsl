#ifdef GL_ES
precision mediump float;
#endif

void main( void ) {
	float time=iGlobalTime*1.0;
	vec2 position = ((gl_FragCoord.xy / iResolution.xy) * 2. - 1.) * vec2(iResolution.x / iResolution.y, 1.0);
	
	float d = abs(0.1 + length(position) - 0.5 * abs(sin(time))) * 5.0;

	
	gl_FragColor += vec4(0.1/d, 0.1 / d, 0.2 / d, 1);

}