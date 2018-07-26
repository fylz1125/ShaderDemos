    #ifdef GL_ES
    precision mediump float;
    #endif

    varying vec4 v_fragmentColor;
    varying vec2 v_texCoord;

    uniform float u_edge;
    uniform float u_offset; 

    vec4 composite(vec4 over, vec4 under)
    {
        return over + (1.0 - over.a)*under;
    }

    void main()
    {   
        float edge = u_edge;
        float offset = u_offset;

        float dis = 0.0;
        vec2 texCoord = vec2(0.5 + (v_texCoord.x - 0.5) * ((offset*2.0) + 1.0), 0.5 + (v_texCoord.y - 0.5) * ((offset*2.0) + 1.0)); 
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

            float gap = edge * 0.1;
            if(dis <= edge - gap)
            {
                gl_FragColor = texture2D( CC_Texture0,texCoord);
            }
            else if(dis <= edge)
            {
                float t = smoothstep(0, gap, dis);
                // gl_FragColor = composite(texture2D( CC_Texture0,texCoord) * (gap - (dis - edge + gap))/gap,vec4( 0.3, 0.3, 0.3,.8));
                gl_FragColor = vec4(0.,0.,0.,1.-t);// 直接设置透明

                  
            }
            else
            {
                gl_FragColor = vec4( 0.3, 0.3, 0.3, (offset - (dis - edge))/offset);
            }
        }
        else
        {

            float absX = abs(texCoord.x - 0.5);
            if(absX > 0.5)
            {
                gl_FragColor = vec4( 0.3, 0.3, 0.3, (offset - (absX - 0.5))/offset);
            }
            else 
            {
                float absY = abs(texCoord.y - 0.5);
                if (absY > 0.5){
                    gl_FragColor = vec4( 0.3, 0.3, 0.3,(offset - (absY - 0.5))/offset);
                }
                else{
                    gl_FragColor = texture2D( CC_Texture0,texCoord);
                }
            }
        }
    }


