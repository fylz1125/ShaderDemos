void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // 纹理坐标
	vec2 uv = fragCoord.xy / iResolution.xy;
    vec4 color = vec4(0.0);
    
    float height = texture2D(iChannel1,uv.xy).r;
    
    color = texture2D(iChannel0,uv.xy);
    
    //remove if for performance
   	// float condition_if_1 = step(height, sin(iGlobalTime + 0.04));
	// float condition_if_2 = step(height, sin(iGlobalTime));

    // color = color * (1. - condition_if_1) + vec4(1.,1.,0.,color.a) * condition_if_1;
    // color = color * (1. - condition_if_2);
    
    // if((height) < (sin(iGlobalTime + 0.04)))
    // {
    //     pixel = vec3(1.,1.,0.);
    // }

 
    
    if(height < iGlobalTime)
    {
        // pixel = vec3(0.,0.,0.);
        discard;
    }
  
    if((height) < (iGlobalTime + 0.04))
    {
        color = vec4(1.,1.,0.2,color.a);
    }
    
    
	fragColor = color;
}

void main()
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}