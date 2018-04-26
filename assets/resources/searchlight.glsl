

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from -1 to 1)
    vec2 uv = (fragCoord ) / iResolution.x;

    // Time varying pixel color
    // vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,2,4));

    vec4 tex = texture2D(iChannel0, uv);
    
    vec3 light_pos = vec3(2.0 * iMouse.x / iResolution.x - 1.0,
                          2.0 * iMouse.y / iResolution.y - 1.0,
                          0.002);
    
    float dist = distance(uv.xy, light_pos.xy);
 
    vec2 d = fragCoord - iMouse.xy;
    vec2 s = .15 * iResolution.xy;
    float r = dot(d, d)/dot(s,s);
    
    /* Phong
    vec4 norm = normalize(tex);
    vec3 NormalVector = vec3(norm.x, norm.y, norm.z);
    
    vec4 white = vec4(1.);
	vec3 LightVector = normalize(vec3(light_pos.x - fragCoord.x, light_pos.y - fragCoord.y, 60.0) + 0.5);
    
    float diffuse = max( dot(NormalVector, LightVector), 0.0);
    
    float distanceFactor = (1. - dist / (light_pos.z * uv.x));
	*/    

    fragColor =  tex * (1.5 - r);   
}
void main()
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
