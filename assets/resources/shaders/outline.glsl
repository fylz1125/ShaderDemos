#ifdef GL_ES
precision mediump float;
#endif


void main()
{
    vec2 onePixel = vec2(1.0 / iResolution.x, 1.0 / iResolution.y);

    vec4 color = texture2D(iChannel0, gl_FragCoord.xy);
    vec4 colorRight = texture2D(iChannel0, gl_FragCoord.xy + vec2(0,onePixel.t));
    vec4 colorBottom = texture2D(iChannel0, gl_FragCoord.xy + vec2(onePixel.s,0));

    color.r = 3.0* sqrt( (color.r - colorRight.r) * (color.r - colorRight.r) + (color.r - colorBottom.r) * (color.r - colorBottom.r) );
    color.g = 3.0* sqrt( (color.g - colorRight.g) * (color.g - colorRight.g) + (color.g - colorBottom.g) * (color.g - colorBottom.g) );
    color.b = 3.0* sqrt( (color.b - colorRight.b) * (color.b - colorRight.b) + (color.b - colorBottom.b) * (color.b - colorBottom.b) );

    color.r >1.0 ? 1.0 : color.r;
    color.g >1.0 ? 1.0 : color.g;
    color.b >1.0 ? 1.0 : color.b;
    gl_FragColor = vec4(color.rgb, 1);
}

