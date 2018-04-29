#ifdef GL_ES
precision mediump float;
#endif

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord ) / iResolution.x;
    vec4 tex = texture2D(iChannel3, uv);
    vec2 d = fragCoord - iMouse.xy;
    vec2 s = 1.25 * iResolution.xy;
    float r = dot(d, d)/dot(s,s);
    fragColor =  tex * (1.2 - r);   
}
void main()
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
