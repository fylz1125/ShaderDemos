
uniform float time;
uniform vec2 resolution;
varying vec2 v_texCoord;

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = v_texCoord.xy; //fragCoord.xy / iResolution.xy;
    
    vec3 colours = vec3(0.0, 0.0, 1.0);
    float backGroundLight = 0.25;
    vec3 lightColours = vec3(1.0, 0.0, 0.0);
    float brightness;
    float intensity = abs(cos(time));
    float size = 100.0;
    vec2 lightPos = resolution.xy / 2.0;
    float dist = distance(uv*resolution, lightPos);
    float distFromEdge = size - dist;
    
    brightness = 1.0 / (dist * ((1.0 / intensity) / size)); // distFromEdge * intensity (original calc)
    brightness -= brightness * (size / dist);
    if(distFromEdge <= 0.0) {
    	brightness = 0.0;
    }
    
    lightColours.xyz *= abs(brightness);
    colours.xyz *= abs(brightness) + backGroundLight;
    colours.xyz += lightColours.xyz;
    
	fragColor = vec4(colours.xyz, 1.0);
}

void main()
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
