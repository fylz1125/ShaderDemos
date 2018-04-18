#ifdef GL_ES
precision mediump float;
#endif

void main( void ) 
{
	vec3 finalColor = vec3( 0.0 );
	
	{
		vec2 uv = ( gl_FragCoord.xy / iResolution.xy) * 2.0 - 1.0; // -1.0 to 1.0
		
		vec2 p = vec2(0., 0.);
		vec2 a = (uv - p);
		float minDistance = 0.001;
		a = mix(vec2(minDistance), a, step(vec2(minDistance), abs(a)));
		
		float t = abs(100.0 / a.y) *  abs(100.0 / a.x);
		finalColor +=  t / 300000000. * vec3( 0.1, 0.5, 0.5 );
	}	
	
	gl_FragColor = vec4( finalColor, 5.0 );
}