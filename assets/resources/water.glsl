#define F cos(x-y)*cos(y),sin(x+y)*sin(y)

vec2 s(vec2 p)
{
    float d=iGlobalTime*0.2,x=8.*(p.x+d),y=8.*(p.y+d);
    return vec2(F);
}
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // 换成resolution
    vec2 rs = iResolution.xy;
    // 换成纹理坐标v_texCoord.xy
    vec2 uv = fragCoord/rs;
    vec2 q = uv+2./iResolution.x*(s(uv)-s(uv+rs));
    //反转y
    //q.y=1.-q.y;
    fragColor = texture2D(iChannel3,q);
}
void main()
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}

