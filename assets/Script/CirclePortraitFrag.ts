// Feofox Game
// Author:Lerry
// https://github.com/fylz1125/ShaderDemos
export default class CircleFrag {
    static circle_vert = `
    attribute vec4 a_position;
    attribute vec2 a_texCoord;
    attribute vec4 a_color;
    varying vec2 v_texCoord;
    varying vec4 v_fragmentColor;
    void main()
    {
        gl_Position = CC_PMatrix * a_position;
        v_fragmentColor = a_color;
        v_texCoord = a_texCoord;
    }
    `;
    static circle_frag = `
    #ifdef GL_ES
    precision mediump float;
    #endif

    varying vec4 v_fragmentColor;
    varying vec2 v_texCoord;

    uniform vec2 size;
    uniform vec2 radiusRatio;
    uniform vec2 deviation;

    void main()
    {
        float differ = 0.0;
        float dis = 0.0;
        if (size.x < size.y)
        {
            differ = 1.0 - size.x/size.y;
            dis = distance(vec2(v_texCoord.x, v_texCoord.y * (1.0 + differ)), vec2(radiusRatio.x, radiusRatio.y + differ/2.0) + deviation);
        }
        else
        {
            differ = size.x/size.y - 1.0;
            dis = distance(vec2(v_texCoord.x * (1.0 + differ), v_texCoord.y), vec2(radiusRatio.x + differ/2.0, radiusRatio.y) + deviation);
        }
        
        if (radiusRatio.x - dis <= 20.2 && radiusRatio.y - dis <= 20.2)
        {
            gl_FragColor = texture2D(CC_Texture0,v_texCoord);
        }
        else
        {
            gl_FragColor = vec4(1.0,.1,0.2,0.);
        }
    }
    `;
}