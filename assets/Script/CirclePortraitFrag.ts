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

    uniform float u_edge;
    uniform float u_offset; 

    void main()
    {
        float edge = u_edge;
        float dis = 0.0;
        vec2 texCoord = v_texCoord;
        if ( texCoord.x < edge )
        {
            if ( texCoord.y < edge )
            {
                dis = distance( texCoord, vec2(edge, edge) );
            }
            if ( texCoord.y > (1.0 - edge) )
            {
                dis = distance( texCoord, vec2(edge, (1.0 - edge)) );
            }
        }
        else if ( texCoord.x > (1.0 - edge) )
        {
            if ( texCoord.y < edge )
            {
                dis = distance( texCoord, vec2((1.0 - edge), edge ) );
            }
            if ( texCoord.y > (1.0 - edge) )
            {
                dis = distance( texCoord, vec2((1.0 - edge), (1.0 - edge) ) );
            }
        }
  
        if(dis > 0.001)
        {
            // 外圈沟
            float gap = edge * 0.02;
            if(dis <= edge - gap)
            {
                gl_FragColor = texture2D( CC_Texture0,texCoord);
            }
            else if(dis <= edge)
            {
                // 平滑过渡
                float t = smoothstep(0.,gap,edge-dis);
                vec4 color = texture2D( CC_Texture0,texCoord);
                gl_FragColor = vec4(color.rgb,t);
            }else{
                gl_FragColor = vec4(0.,0.,0.,0.);
            }
        }
        else
        {
            gl_FragColor = texture2D( CC_Texture0,texCoord);
        }
    }

    `;
}