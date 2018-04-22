// [2TC 15] Water2D
// Copyleft {c} 2015 Michael Pohoreski
// Chars: 260
//
// Notes:
// - If you want to speed up / slow this down, change the contant in `d` iGlobalTime*0.2
//
// - A "naive" water filter is: 
//     #define F cos(x)*cos(y),sin(x)*sin(y)
//   We use this one:
//     #define F cos(x-y)*cos(y),sin(x+y)*sin(y)
// Feel free to post your suggestions!
//
// For uber minification,
// - You can replace:
//     2.0 / uvResolution.x
//   With say a hard-coded constant:
//     0.007
// Inline the #define

// Minified

// #if 0

#define F cos(x-y)*cos(y),sin(x+y)*sin(y)

vec2 s(vec2 p)
{
    float d=iGlobalTime*0.2,x=8.*(p.x+d),y=8.*(p.y+d);
    return vec2(F);
}

void mainImage( out vec4 f, in vec2 w )
{
    vec2 i=iResolution.xy,r=w/i,q=r+2./iResolution.x*(s(r)-s(r+i));
    //反转y
    //q.y=1.-q.y;
    f=texture2D(iChannel0,q);
}

void main()
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}

