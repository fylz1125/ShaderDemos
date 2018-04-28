// Feofox Game
// Author:Lerry
// https://github.com/fylz1125/ShaderDemos
export default class FluxayFrag{
    static fluxay_vert = `
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

    // 流光特效
    static fluxay_frag = `
    #ifdef GL_ES
    precision mediump float;
    #endif
    varying vec2 v_texCoord;
    uniform float time;
    void main()
    {
        vec4 src_color = texture2D(CC_Texture0, v_texCoord).rgba;

        float width = 0.02;       //流光的宽度范围 (调整该值改变流光的宽度)
        float start = tan(time/1.414);  //流光的起始x坐标
        float strength = 0.006;   //流光增亮强度   (调整该值改变流光的增亮强度)
        float offset = 0.5;      //偏移值         (调整该值改变流光的倾斜程度)
        if( v_texCoord.x < (start - offset * v_texCoord.y) &&  v_texCoord.x > (start - offset * v_texCoord.y - width))
        {
            vec3 improve = strength * vec3(255, 255, 255);
            vec3 result = improve * vec3( src_color.r, src_color.g, src_color.b);
            gl_FragColor = vec4(result, src_color.a);

        }else{
            gl_FragColor = src_color;
        }
    }
    `;

    // 流光的另一种写法
    static fluxay_frag_s = `
    #ifdef GL_ES                                 
    precision mediump float;                          
    #endif                                          
    
    varying vec4 v_fragmentColor;                  
    varying vec2 v_texCoord;                      
    
    // uniform float factor;  
    // uniform float width;  
    uniform float time;  
    // uniform vec3 color; 
    void main()                                      
    {   
        float factor = .06;
        float width = .02;
        // float offset = .5;
        vec3 color = vec3(10.,10.,10.);                                           
        vec4 texColor = texture2D(CC_Texture0, v_texCoord);  
    
        float distance = abs(v_texCoord[0]+v_texCoord[1]-tan(time))/1.414;   

        distance = 1.0-(1.0/width)*distance;  
        distance = max(distance, 0.0);  
        vec4 sample = vec4(0.0,0.0,0.0,0.0);  
        sample[0] = color[0] * distance;  
        sample[1] = color[1] * distance;  
        sample[2] = color[2] * distance;  
        sample[3] = distance;  

        float alpha = sample[3]*texColor[3];  
        texColor[0] = texColor[0] + sample[0]*alpha*factor;  
        texColor[1] = texColor[1] + sample[1]*alpha*factor;  
        texColor[2] = texColor[2] + sample[2]*alpha*factor;  
        gl_FragColor = v_fragmentColor * texColor;  
    }
     `;
    // 波光特效
    static fluxay_frag_super = `
    #define TAU 6.120470874064187
    #define MAX_ITER 5
    uniform float time; 
    varying vec2 v_texCoord;
    varying vec4 v_fragmentColor;
    void mainImage( out vec4 fragColor, in vec2 fragCoord ) 
    {
        float time = time * .5+5.;
        // uv should be the 0-1 uv of texture...
        vec2 uv = v_texCoord.xy;//fragCoord.xy / iResolution.xy;
        

        vec2 p = mod(uv*TAU, TAU)-250.0;

        vec2 i = vec2(p);
        float c = 1.0;
        float inten = .0045;

        for (int n = 0; n < MAX_ITER; n++) 
        {
            float t =  time * (1.0 - (3.5 / float(n+1)));
            i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(1.5*t + i.x));
            c += 1.0/length(vec2(p.x / (cos(i.x+t)/inten),p.y / (cos(i.y+t)/inten)));
        }
        c /= float(MAX_ITER);
        c = 1.17-pow(c, 1.4);
        vec4 tex = texture2D(CC_Texture0,uv);
        vec3 colour = vec3(pow(abs(c), 20.0));
        colour = clamp(colour + vec3(0.0, 0.0, .0), 0.0, tex.a);

        // 混合波光
        float alpha = c*tex[3];  
        tex[0] = tex[0] + colour[0]*alpha; 
        tex[1] = tex[1] + colour[1]*alpha; 
        tex[2] = tex[2] + colour[2]*alpha; 
        fragColor = v_fragmentColor * tex;
    }
    void main()
    {
        mainImage(gl_FragColor, gl_FragCoord.xy);
    }
    `;
}
