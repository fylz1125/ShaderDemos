export default class BlursFrag {
    static blurs_vert = `
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
    static blurs_frag = `
    #ifdef GL_ES
    precision mediump float;
    #endif
    uniform float bluramount;
    varying vec2 v_texCoord;
    vec4 draw(vec2 uv) {
    return texture2D(CC_Texture0,uv).rgba; 
    }
    float grid(float var, float size) {
    return floor(var*size)/size;
    }
    float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
    }
    void mainImage( out vec4 fragColor, in vec2 fragCoord )
    {
    vec2 uv = v_texCoord.xy;
    vec4 blurred_image = vec4(0.);
    #define repeats 5.
    for (float i = 0.; i < repeats; i++) { 
    vec2 q = vec2(cos(degrees((i/repeats)*360.)),sin(degrees((i/repeats)*360.))) * (rand(vec2(i,uv.x+uv.y))+bluramount); 
    vec2 uv2 = uv+(q*bluramount);
    blurred_image += draw(uv2)/2.;
    q = vec2(cos(degrees((i/repeats)*360.)),sin(degrees((i/repeats)*360.))) * (rand(vec2(i+2.,uv.x+uv.y+24.))+bluramount); 
    uv2 = uv+(q*bluramount);
    blurred_image += draw(uv2)/2.;
    }
    blurred_image /= repeats;
    fragColor = vec4(blurred_image);
    }
    void main()
    {
    mainImage(gl_FragColor, gl_FragCoord.xy);
    }
    `;
}