void mainImage(out vec4 col, in vec2 coo)
{
	vec2 uv = (coo - iResolution.xy * 0.5) / iResolution.y;
    vec3 c = vec3 (0.0);  
    for(float i = 0.0; i <= 1.0; i += 1.0) {
        for(float x = -0.8; x <= 0.8; x += 1.6 / 32.0){
            float v = 0.0025 / length(uv - vec2(x, sin(i * 2.0 + x * 5.0 + iGlobalTime)* 0.4)); 
            c += v * vec3 (1.0 - i * 0.5, i -x, i + x * 2.0);
        }
    }
    col = vec4(c, 1.0);
}
void main()
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
