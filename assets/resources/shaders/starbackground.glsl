#ifdef GL_ES
precision mediump float;
#endif

#define M_PI 3.1415926535897932384626433832795

float rand(vec2 co)
{
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	float size = 30.0;
	float prob = 0.95;
	
	vec2 pos = floor(1.0 / size * fragCoord.xy);
	
	float color = 0.0;
    float g = .0;
    float b = .0;
	float starValue = rand(pos);
	
	if (starValue > prob)
	{
		vec2 center = size * pos + vec2(size, size) * 0.5;
		
		float t = 0.9 + .9*sin(.3*iGlobalTime) * sin(iGlobalTime + (starValue - prob) / (1.0 - prob) * 45.0);
				
		color = 1.0 - distance(fragCoord.xy, center) / (0.5 * size);
		color = color * t/ (abs(fragCoord.y - center.y)) * t / (abs(fragCoord.x - center.x));
        b = color *sin(t)*t;
        g = color*t;
	}
	else if (rand(fragCoord.xy / iResolution.xy) > 0.996)
	{
		float r = rand(fragCoord.xy);
		color = r * (0.35 * sin(iGlobalTime * (r * 5.0) + 720.0 * r) + 0.75);
        g = r * (0.35 * sin(iGlobalTime * (r * 5.0) + 720.0 * r) + 0.75);
        b = r * (0.35 * sin(iGlobalTime * (r * 5.0) + 720.0 * r) + 0.75);
	}
	
	fragColor = vec4(vec3(color,g,b), 1.0);
}
void main()
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}