#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 resolution;
varying vec2 v_texCoord;
void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    // 转换坐标
	// vec2 uv = ( fragCoord - resolution.xy * 0.5) / resolution.y;
    vec2 rs = resolution.xy;
    vec2 luv= v_texCoord.xy;
	vec2 uv = ( rs*luv - rs * 0.5) / resolution.y;
    vec3 c = vec3 (0.);  
    for(float i = 0.0; i <= 1.0; i += 1.0) {
        for(float x = -0.8; x <= 0.8; x += 1.6 / 32.0){
            float v = 0.0025 / length(uv - vec2(x, sin(i * 2.0 + x * 5.0 + time)* 0.4)); 
            c += v * vec3 (1.0 - i * 0.5, i -x, i + x * 2.0);
        }
    }
    fragColor = vec4(c, 1.);
}
void main()
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
