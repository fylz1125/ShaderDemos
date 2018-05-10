#define M_PI 3.1415926535897932384626433832795

float map(float value, float min1, float max1, float min2, float max2)
{
    float perc = (value - min1) / (max1 - min1);
    return perc * (max2 - min2) + min2;
}

float standardDeviation(vec3 colour)
{
    float mean = (colour.r + colour.g + colour.b) / 3.0;
    float sum = (colour.r - mean) * (colour.r - mean) +
        		(colour.g - mean) * (colour.g - mean) +
        		(colour.b - mean) * (colour.b - mean);
    
    float mean_sum = sum / 3.0;
    
    return sqrt(mean_sum);
}

float grayPercentage(vec3 colour)
{
    return 1.0-standardDeviation(colour.rgb);  
}

float colourDistance(vec4 compare, vec4 to)
{
    return sqrt((to.r - compare.r) * (to.r - compare.r) +
        	(to.g - compare.g) * (to.g - compare.g) +
        	(to.b - compare.b) * (to.b - compare.b));
}

float heatDistortionIntensity(vec2 uvCoord)
{
    float result = (1.0-uvCoord.y) * (1.0-uvCoord.y) * (1.0-uvCoord.y);
    return map(result, 0.0, 1.0, 0.0, 0.15);
}

float rand(vec2 co)
{
    highp float a = 12.9898;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float dt= dot(co.xy ,vec2(a,b));
    highp float sn= mod(dt,3.14);
    return fract(sin(sn) * c);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord/iResolution.xy;
    
    float waves = 15.0;
    float frequency = uv.y * 2.1 * M_PI * waves;
    float amplitude = 0.0040 * heatDistortionIntensity(uv);
    float speed = 60.0;
    float phase = M_PI/4.0 + iGlobalTime * speed;
    float sine_range = sin(-phase + frequency) * amplitude;
    
    vec2 distort = vec2(sine_range,0.0);
    
    // Simple blur based on rand function
    // Fast, but not the prettiest
    vec2 blur = vec2(rand(uv + vec2(iGlobalTime)) / 30.0 * heatDistortionIntensity(uv));
    
    // Output to screen
    fragColor = texture2D(iChannel3, uv + distort + blur);
}

void main(void){
	mainImage(gl_FragColor, gl_FragCoord.xy);
}
   