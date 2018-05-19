export default class DissolveFrag {
    static vert =`
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
    
    static frag=`
    #ifdef GL_ES
    precision lowp float;
    #endif

    uniform vec2 resolution;
    uniform float time;
    uniform sampler2D texture1;

    varying vec2 v_texCoord;
    varying vec4 v_fragmentColor;
    void mainImage( out vec4 fragColor, in vec2 fragCoord )
    {
        // 纹理坐标
        vec2 uv = v_texCoord;
        // 法向纹理r通道
        float height = texture2D(texture1,uv).r;
        // 采样纹理
        vec4 color = v_fragmentColor * texture2D(CC_Texture0,uv);

        if(height < time)
        {
            discard;
        }
        
        if(height < time+0.04)
        {
            // 溶解颜色，可以自定义
            color = vec4(.9,.6,0.3,color.a);
        }
        
        fragColor = color;
    }

    void main()
    {
        mainImage(gl_FragColor, gl_FragCoord.xy);
    }
    `;
}