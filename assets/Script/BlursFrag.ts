export default class BlursFrag {
    static blursFrag = `
#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 resolution;
varying vec4 v_fragmentColor;
varying vec2 v_texCoord;
vec3 draw(vec2 uv) {
    return texture2D(CC_Texture0,uv).rgb; 
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
    float bluramount = 0.005;
    vec3 blurred_image = vec3(0.);
    #define repeats 60.
    for (float i = 0.; i < repeats; i++) { 
        vec2 q = vec2(cos(degrees((i/repeats)*360.)),sin(degrees((i/repeats)*360.))) *  (rand(vec2(i,uv.x+uv.y))+bluramount); 
        vec2 uv2 = uv+(q*bluramount);
        blurred_image += draw(uv2)/2.;
        q = vec2(cos(degrees((i/repeats)*360.)),sin(degrees((i/repeats)*360.))) *  (rand(vec2(i+2.,uv.x+uv.y+24.))+bluramount); 
        uv2 = uv+(q*bluramount);
        blurred_image += draw(uv2)/2.;
    }
    blurred_image /= repeats;
    fragColor = vec4(blurred_image,1.0);
}
void main()
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
    `;
}