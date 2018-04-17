/* 平均值黑白 */
module.exports = 
`
#ifdef GL_ES
precision mediump float;
#endif
varying vec2 v_texCoord;
void main()
{
    vec4 v = texture2D(CC_Texture0, v_texCoord).rgba;
    float f = (v.r + v.g + v.b) / 3.0;
    gl_FragColor = vec4(f, f, f, v.a);
}
`