#ifdef GL_ES
precision mediump float;
#endif
varying vec2 v_texCoord;
uniform float time;
void main( void ) {
	// 在预览插件使用
	// float time=iGlobalTime*1.0;
	// vec2 position = ((gl_FragCoord.xy / iResolution.xy) * 2. - 1.) * vec2(iResolution.x / iResolution.y, 1.0);
	// 纹理坐标
	vec2 uv= v_texCoord.xy;
	// 用纹理坐标来确定大小和位置
	vec2 position = (uv * 2.-1.) * vec2(1.0, 1.0);
	
	float d = abs(0.1 + length(position) - 0.5 * abs(sin(time))) * 5.0;
	gl_FragColor += vec4(0.1/d, 0.1 / d, 0.2 / d, 1);

}