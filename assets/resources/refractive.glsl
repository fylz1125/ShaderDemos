// HeatHaze - written 2015 by Jakob Thomsen
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

vec2 drop(vec2 uv, vec2 pos, float r)
{
    pos.y = fract(pos.y);
    return (uv - pos) * exp(-pow(20.0 * length(uv - pos), 2.0));
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy / iResolution.xy;
    uv.y = 1.-uv.y;
    vec2 uv2 = vec2(uv.x * iResolution.x / iResolution.y, uv.y);
    
    vec2 d = vec2(1.0, 1.0);
    const int n = 100;
    for(int i = 0; i < n; i++)
    {
        vec4 r = texture2D(iChannel1, vec2(float(i) / float(n), 0.5));
        vec2 pos = r.xy;
        pos.x *=  iResolution.x / iResolution.y;
        pos.y += 16.0 * iGlobalTime * 0.015 * r.a;
        //pos.x += sin(t + r.z);
    	d += 0.1 * drop(uv2.xy, pos, 0.03);
    }

	fragColor = texture2D(iChannel3, -uv.xy + d);
    //if(length(d) > 0.0) fragColor.rgb *= 0.5;
}
void main(void){
	mainImage(gl_FragColor, gl_FragCoord.xy);
}
   