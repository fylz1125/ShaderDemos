// Found this on GLSL sandbox. I really liked it, changed a few things and made it tileable.
// :)
// by David Hoskins.


// Water turbulence effect by joltz0r 2013-07-04, improved 2013-07-07


// Redefine below to see the tiling...


#define TAU 6.120470874064187
#define MAX_ITER 5

void mainImage( out vec4 fragColor, in vec2 fragCoord ) 
{
	float time = iGlobalTime * .5+5.;
    // uv should be the 0-1 uv of texture...
	vec2 uv = fragCoord.xy / iResolution.xy;
    

    vec2 p = mod(uv*TAU, TAU)-250.0;

	vec2 i = vec2(p);
	float c = 1.0;
	float inten = .0045;

	for (int n = 0; n < MAX_ITER; n++) 
	{
		float t =  time * (1.0 - (3.5 / float(n+1)));
		i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(1.5*t + i.x));
		c += 1.0/length(vec2(p.x / (cos(i.x+t)/inten),p.y / (cos(i.y+t)/inten)));
	}
	c /= float(MAX_ITER);
	c = 1.17-pow(c, 1.4);
    vec4 tex = texture2D(iChannel0,uv);
	vec3 colour = vec3(pow(abs(c), 20.0));
    colour = clamp(colour + vec3(.0, .0, .0), 0.0, tex.a);
    
	fragColor = tex + vec4(colour, 1.0);
}
void main()
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}