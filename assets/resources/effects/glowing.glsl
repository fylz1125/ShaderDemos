// 外发光shader
const float radius = 10.0;
const vec3 glowColor = vec3(0.9, 0.2, 0.0);

float coefficient()
{
	float v = mod(iGlobalTime, 3.0);
    if(v > 1.5)
        v = 3.0 - v;
    return v;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy / iResolution.xy;
    vec2 unit = 1.0 / iResolution.xy;
    vec4 texel = texture2D(iChannel0, uv);
    vec4 finalColor = vec4(0.0);
    float density = 0.0;

   	if(texel.a >= 1.0)
    {
        finalColor = vec4(texel.rgb, 1.0);
    }
    else
    {
        for(int i = 0; i < int(radius); ++i)
        {
            density += texture2D(iChannel0, vec2(uv.x + unit.x * float(i), uv.y + unit.y * float(i))).a;
            density += texture2D(iChannel0, vec2(uv.x - unit.x * float(i), uv.y + unit.y * float(i))).a;
            density += texture2D(iChannel0, vec2(uv.x - unit.x * float(i), uv.y - unit.y * float(i))).a;
            density += texture2D(iChannel0, vec2(uv.x + unit.x * float(i), uv.y - unit.y * float(i))).a;

            //density += texture(iChannel0, vec2(uv.x - unit.x * i, uv.y)).a;
            //density += texture(iChannel0, vec2(uv.x + unit.x * i, uv.y)).a;
            //density += texture(iChannel0, vec2(uv.x, uv.y - unit.y * i)).a;
            //density += texture(iChannel0, vec2(uv.x, uv.y + unit.y * i)).a;

        }
        finalColor = vec4(glowColor * density / radius * coefficient(), 1.0);
        finalColor += vec4(texel.rgb * texel.a, texel.a);
    }
	fragColor = finalColor;
}
void main()
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
