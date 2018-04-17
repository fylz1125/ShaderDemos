#ifdef GL_ES
precision mediump float;
#endif

void main( void ) {
	vec2 uv = (gl_FragCoord.xy / iResolution.xy);
	uv.y += .02 * sin(iGlobalTime + uv.x * 2.2);
	uv.x += .02 * sin(iGlobalTime + uv.y * 2.2);
	vec4 color = texture2D(iChannel0, uv);
	color = color * color;
	gl_FragColor = color;
}