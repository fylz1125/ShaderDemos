// Created by inigo quilez - iq/2013
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 p = (2.0*fragCoord-iResolution.xy)/min(iResolution.y,iResolution.x);
	
    // background color
    vec3 bcol = vec3(1.0,0.8,0.7-0.07*p.y)*(1.0-0.25*length(p));

    // animate
    float tt = mod(iGlobalTime,1.5)/1.5;
    float ss = pow(tt,.2)*0.5 + 0.5;
    ss = 1.0 + ss*0.5*sin(tt*6.2831*3.0 + p.y*0.5)*exp(-tt*4.0);
    p *= vec2(0.5,1.5) + ss*vec2(0.5,-0.5);

    // shape
#if 0
    p *= 0.8;
    p.y = -0.1 - p.y*1.2 + abs(p.x)*(1.0-abs(p.x));
    float r = length(p);
	float d = 0.5;
#else
	p.y -= 0.25;
    float a = atan(p.x,p.y)/3.141593;
    float r = length(p);
    float h = abs(a);
    float d = (13.0*h - 22.0*h*h + 10.0*h*h*h)/(6.0-5.0*h);
#endif
    
	// color
	float s = 0.75 + 0.75*p.x;
	s *= 1.0-0.4*r;
	s = 0.3 + 0.7*s;
	s *= 0.5+0.5*pow( 1.0-clamp(r/d, 0.0, 1.0 ), 0.1 );
	vec3 hcol = vec3(1.0,0.5*r,0.3)*s;
	
    vec3 col = mix( bcol, hcol, smoothstep( -0.01, 0.01, d-r) );

    fragColor = vec4(col,1.0);
}

void main(void){
	mainImage(gl_FragColor, gl_FragCoord.xy);
}