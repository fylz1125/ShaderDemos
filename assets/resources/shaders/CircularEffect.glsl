#ifdef GL_ES
precision mediump float;
#endif

varying vec4 v_fragmentColor;
varying vec2 v_texCoord;

uniform vec2 size;
uniform vec2 radiusRatio;
uniform vec2 deviation;


float getDistance(vec2 pos_src, vec2 pos_dist)
{
    float dis = pow((pos_src.x - pos_dist.x), 2.) + pow((pos_src.y - pos_dist.y), 2.);
    return sqrt(dis);
}

void main()
{
    float differ = 0.0;
    float dis = 0.0;
    if (size.x < size.y)
    {
        differ = 1.0 - size.x/size.y;
        dis = getDistance(vec2(v_texCoord.x, v_texCoord.y * (1.0 + differ)), vec2(radiusRatio.x, radiusRatio.y + differ/2.0) + deviation);
    }
    else
    {
        differ = size.x/size.y - 1.0;
        dis = getDistance(vec2(v_texCoord.x * (1.0 + differ), v_texCoord.y), vec2(radiusRatio.x + differ/2.0, radiusRatio.y) + deviation);
    }
    
    if (radiusRatio.x - dis <= 0.02 && radiusRatio.y - dis <= 0.02)
    {
        gl_FragColor = texture2D(CC_Texture0,v_texCoord);
    }
    else
    {
        gl_FragColor = vec4(1.,0,0,0);
    }
}


