#ifdef GL_ES
precision mediump float;
#endif


void main()
{
    vec2 r = iResolution.xy,
    o = gl_FragCoord.xy - r/2.;
    o = vec2(length(o) / r.y - .3, atan(o.y,o.x));    
    vec4 s = .1*cos(1.6*vec4(0,1,2,3) + iGlobalTime + o.y + sin(o.x) * sin(iMouse.x * iGlobalTime / 1. + 5.4)*2.),
    e = s.yzwx, 
    f = min(o.x-s,e-o.x);
    gl_FragColor = dot(clamp(f*r.y,0.,1.), 40.*(s-e)) * (s-.1) - f;
}