#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 resolution;
varying vec2 v_texCoord;
void main(void){
    vec2 uv = v_texCoord.xy;
    vec2 rs = resolution.xy;
    vec2 p = (uv*rs * 2. - rs) / min(resolution.x, resolution.y);
    vec3 destColor = vec3(1.0, 0.3, 0.7);
    float f = 0.;
    for(float i = 0.0; i < 12.0; i+=0.1){
        float s = (sin(time + i * sin(time*0.1)*27.0/9.) *  0.5);
        float c = sin(cos(time + i * cos(time*0.05)*01.27/2.) * sin(time*0.5));
        f += (0.0027 / abs(length(p + vec2(c, s)) - .25));
    }
    gl_FragColor = vec4(vec3(destColor * f*0.27), 1.5);
}