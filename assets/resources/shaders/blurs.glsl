#ifdef GL_ES
precision mediump float;
#endif

varying vec2 v_texCoord;
vec3 draw(vec2 uv) {
    // return texture2D(iChannel0,vec2(uv.x,1.-uv.y)).rgb; // 上下翻转
    return texture2D(iChannel0,uv).rgb;  
}

float grid(float var, float size) {
    return floor(var*size)/size;
}

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float time = iGlobalTime;
    // 移植需要传入图片坐标，否则就是原点
    // vec2 uv = v_texCoord.xy;
    vec2 uv = (fragCoord.xy / iResolution.xy);
    // 时间函数
    float bluramount = 0.005; //sin(time)*0.01;
    // if (iMouse.w >= 1.) {
    //     bluramount = (iMouse.x/iResolution.x)/10.;
    // }
    vec3 blurred_image = vec3(0.);
    #define repeats 60.
    for (float i = 0.; i < repeats; i++) { 
        vec2 q = vec2(cos(degrees((i/repeats)*360.)),sin(degrees((i/repeats)*360.))) *  (rand(vec2(i,uv.x+uv.y))+bluramount); 
        vec2 uv2 = uv+(q*bluramount);
        blurred_image += draw(uv2)/2.;
        //One more to hide the noise.
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