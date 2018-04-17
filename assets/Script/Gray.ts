export default class Gray{
    static vert = `
    attribute vec4 a_position;
    attribute vec2 a_texCoord;
    attribute vec4 a_color;
    varying vec4 v_fragmentColor; 
    varying vec2 v_texCoord; 
    void main() 
    { 
        gl_Position = CC_PMatrix * a_position;
        v_fragmentColor = a_color; 
        v_texCoord = a_texCoord; 
    }
    `;

    static frag = `
    #ifdef GL_ES
    precision lowp float;
    #endif
    
    varying vec4 v_fragmentColor;
    varying vec2 v_texCoord;
    void main()
    {
        vec4 c = v_fragmentColor * texture2D(CC_Texture0, v_texCoord);
        gl_FragColor.xyz = vec3(0.2126*c.r + 0.7152*c.g + 0.0722*c.b);
        gl_FragColor.w = c.w;
    }
    `;
}
