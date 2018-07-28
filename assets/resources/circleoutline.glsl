#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
varying vec2 v_texCoord;

float ringWidth = 0.45;
vec3 ringColor = vec3(1.0,0.3,0.3);

vec4 outline(float width, vec2 tc, vec3 color, sampler2D tex){
    vec4 t = texture2D(tex, tc);
    tc -= 0.5;
    tc.x *= resolution.x / resolution.y;
    
    float grad = length(tc);
    float circle = smoothstep(0.5, 0.48, grad);
    float ring = circle - smoothstep(width, width-0.03, grad);
    
    t = (t * (circle - ring));
    t.rgb += (ring * ringColor);
    
    return t;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = v_texCoord.xy;

    vec4 t = outline(ringWidth, uv, ringColor, CC_Texture0);
     
    fragColor = t;
}

void main()
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}