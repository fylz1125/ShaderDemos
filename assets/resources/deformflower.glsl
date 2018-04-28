// Created by inigo quilez - iq/2013
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;
varying vec2 v_texCoord;
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	// vec2 p = (2.0*fragCoord-resolution.xy)/min(resolution.y,resolution.x);
    // 修改为creator坐标
    vec2 uv = v_texCoord.xy;
    vec2 rs = resolution.xy;
	vec2 p = (2.0*uv*rs - rs)/min(resolution.y,resolution.x);

    float a = atan(p.x,p.y);
    float r = length(p)*(0.8+0.2*sin(0.3*time));

    float w = cos(2.0*time-r*2.0);
    float h = 0.5+0.5*cos(12.0*a-w*7.0+r*8.0+ 0.7*time);
    float d = 0.25+0.75*pow(h,1.0*r)*(0.7+0.3*w);

    float f = sqrt(1.0-r/d)*r*2.5;
    f *= 1.25+0.25*cos((12.0*a-w*7.0+r*8.0)/2.0);
    f *= 1.0 - 0.35*(0.5+0.5*sin(r*30.0))*(0.5+0.5*cos(12.0*a-w*7.0+r*8.0));
	
	vec3 col = vec3( f,
					 f-h*0.5+r*.2 + 0.35*h*(1.0-r),
                     f-h*r + 0.1*h*(1.0-r) );
	col = clamp( col, 0.0, 1.0 );
	
	vec3 bcol = mix( 0.5*vec3(0.8,0.9,1.0), vec3(1.0), 0.5+0.5*p.y );
	col = mix( col, bcol, smoothstep(-0.3,0.6,r-d) );
    
    fragColor = vec4( col, 1.0 );
}

void main()
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
