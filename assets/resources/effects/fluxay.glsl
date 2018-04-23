const float lineWidth = 0.05;
const float factor = 0.8;
const float speed = 5.2;

float pointToLine( vec2 pos, vec2 lineDir, vec2 linePoint ) {
 	lineDir = normalize( lineDir );
    vec2 pointDir = pos - linePoint;
    float s1 = dot( lineDir, pointDir );
    return sqrt( dot( pointDir, pointDir ) - s1 * s1 );
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float strength = 0.007;
	vec2 uv = fragCoord.xy / iResolution.xy;
    float dis = pointToLine( uv, vec2( .5, 2.5 ), vec2( 0.0, 1.0 - tan(iGlobalTime) * speed ) );
    float a = max( 1.0 - dis / lineWidth, 0.0 );
    
    vec4 color0 = texture2D( iChannel0, uv );
    vec3 improve = strength * vec3(255, 255, 255);
    vec3 result = improve * vec3( color0.r, color0.g, color0.b);
    float alpha = color0.a ;
	fragColor = color0 + vec4(result,1.)*a;
}

void main()
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
