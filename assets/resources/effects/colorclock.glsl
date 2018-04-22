void mainImage( out vec4 O, in vec2 u )
{
    vec2 R = iResolution.xy, U = (u+u-R)/R.y;
    float t = iGlobalTime,                        
    a = fract( atan(U.x,U.y) / 6.2832 -t ) + t;
    O = .6 + .6 * cos( a + vec4(0,23,21,0) );
}

void main(void){
	mainImage(gl_FragColor, gl_FragCoord.xy);
}