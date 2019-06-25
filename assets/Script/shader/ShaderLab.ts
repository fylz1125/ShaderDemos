
const MVP = `
uniform mat4 viewProj;
uniform mat4 model;
attribute vec3 a_position;
attribute vec2 a_uv0;
varying vec2 uv0;
void main () {
    mat4 mvp;
    mvp = viewProj * model;
    vec4 pos = mvp * vec4(a_position, 1);
    gl_Position = pos;
    uv0 = a_uv0;
}
`;

const ShaderLab = {
    GrayScaling: {
        vert: MVP,
        frag: 
`
uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;
void main () {
    vec4 c = texture2D(texture, uv0);
    float gray = dot(c.rgb, vec3(0.299 * 0.5, 0.587 * 0.5, 0.114 * 0.5));
    gl_FragColor = vec4(gray, gray, gray, c.a * 0.5);
}
`
    },
    Stone: {
        vert: MVP,
        frag: 
`
uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;
void main () {
    vec4 c = color * texture2D(texture, uv0);
    float clrbright = (c.r + c.g + c.b) * (1. / 3.);
    float gray = (0.6) * clrbright;
    gl_FragColor = vec4(gray, gray, gray, c.a);
}
`
    },
    Ice: {
        vert: MVP,
        frag: 
`
uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;
void main () {
    vec4 clrx = color * texture2D(texture, uv0);
    float brightness = (clrx.r + clrx.g + clrx.b) * (1. / 3.);
	float gray = (1.5)*brightness;
	clrx = vec4(gray, gray, gray, clrx.a)*vec4(0.8,1.2,1.5,1);
    gl_FragColor =clrx;
}
`
    },
    Frozen: {
        vert: MVP,
        frag: 
`
uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;
void main () {
    vec4 c = color * texture2D(texture, uv0);
    c *= vec4(0.8, 1, 0.8, 1);
	c.b += c.a * 0.2;
    gl_FragColor = c;
}
`
    },
    Mirror: {
        vert: MVP,
        frag: 
`
uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;
void main () {
    vec4 c = color * texture2D(texture, uv0);
    c.r *= 0.5;
    c.g *= 0.8;
    c.b += c.a * 0.2;
    gl_FragColor = c;
}
`
    },
    Poison: {
        vert: MVP,
        frag: 
`
uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;
void main () {
    vec4 c = color * texture2D(texture, uv0);
    c.r *= 0.8;
	c.r += 0.08 * c.a;
	c.g *= 0.8;
    c.g += 0.2 * c.a;
	c.b *= 0.8;
    gl_FragColor = c;
}
`
    },
    Banish: {
        vert: MVP,
        frag: 
`
uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;
void main () {
    vec4 c = color * texture2D(texture, uv0);
    float gg = (c.r + c.g + c.b) * (1.0 / 3.0);
    c.r = gg * 0.9;
    c.g = gg * 1.2;
    c.b = gg * 0.8;
    c.a *= (gg + 0.1);
    gl_FragColor = c;
}
`
    },
    Vanish: {
        vert: MVP,
        frag: 
`
uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;
void main () {
    vec4 c = color * texture2D(texture, uv0);
    float gray = (c.r + c.g + c.b) * (1. / 3.);
    float rgb = gray * 0.8;
    gl_FragColor = vec4(rgb, rgb, rgb, c.a * (gray + 0.1));
}
`
    },
    Invisible: {
        vert: MVP,
        frag: 
`
void main () {
    gl_FragColor = vec4(0,0,0,0);
}
`
    },
    Blur: {
        vert: MVP,
        frag: 
`
uniform sampler2D texture;
uniform vec4 color;
uniform float num;
varying vec2 uv0;
void main () {
    vec4 sum = vec4(0.0);
    vec2 size = vec2(num,num);
    sum += texture2D(texture, uv0 - 0.4 * size) * 0.05;
	sum += texture2D(texture, uv0 - 0.3 * size) * 0.09;
	sum += texture2D(texture, uv0 - 0.2 * size) * 0.12;
	sum += texture2D(texture, uv0 - 0.1 * size) * 0.15;
	sum += texture2D(texture, uv0             ) * 0.16;
	sum += texture2D(texture, uv0 + 0.1 * size) * 0.15;
	sum += texture2D(texture, uv0 + 0.2 * size) * 0.12;
	sum += texture2D(texture, uv0 + 0.3 * size) * 0.09;
    sum += texture2D(texture, uv0 + 0.4 * size) * 0.05;
    
    vec4 vectemp = vec4(0,0,0,0);
    vec4 substract = vec4(0,0,0,0);
    vectemp = (sum - substract) * color;

    float alpha = texture2D(texture, uv0).a;
    if(alpha < 0.05) { gl_FragColor = vec4(0 , 0 , 0 , 0); }
	else { gl_FragColor = vectemp; }
}
`
    },
    GaussBlur: {
        vert: MVP,
        frag: 
`
#define repeats 5.
uniform sampler2D texture;
uniform vec4 color;
uniform float num;
varying vec2 uv0;

vec4 draw(vec2 uv) {
    return color * texture2D(texture,uv).rgba; 
}
float grid(float var, float size) {
    return floor(var*size)/size;
}
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}
void main()
{
    vec4 blurred_image = vec4(0.);
    for (float i = 0.; i < repeats; i++) { 
        vec2 q = vec2(cos(degrees((i/repeats)*360.)),sin(degrees((i/repeats)*360.))) * (rand(vec2(i,uv0.x+uv0.y))+num); 
        vec2 uv2 = uv0+(q*num);
        blurred_image += draw(uv2)/2.;
        q = vec2(cos(degrees((i/repeats)*360.)),sin(degrees((i/repeats)*360.))) * (rand(vec2(i+2.,uv0.x+uv0.y+24.))+num); 
        uv2 = uv0+(q*num);
        blurred_image += draw(uv2)/2.;
    }
    blurred_image /= repeats;
    gl_FragColor = vec4(blurred_image);
}
`
    },
    Dissolve: {
        vert: MVP,
        frag: 
`
uniform sampler2D texture;
uniform vec4 color;
uniform float time;
varying vec2 uv0;

void main()
{
    vec4 c = color * texture2D(texture,uv0);
    float height = c.r;
    if(height < time)
    {
        discard;
    }
    if(height < time+0.04)
    {
        // 溶解颜色，可以自定义
        c = vec4(.9,.6,0.3,c.a);
    }
    gl_FragColor = c;
}
`
    },
    Fluxay: {
        vert: MVP,
        frag: 
`
uniform sampler2D texture;
uniform vec4 color;
uniform float time;
varying vec2 uv0;

void main()
{
    vec4 src_color = color * texture2D(texture, uv0).rgba;

    float width = 0.08;       //流光的宽度范围 (调整该值改变流光的宽度)
    float start = tan(time/1.414);  //流光的起始x坐标
    float strength = 0.008;   //流光增亮强度   (调整该值改变流光的增亮强度)
    float offset = 0.5;      //偏移值         (调整该值改变流光的倾斜程度)
    if(uv0.x < (start - offset * uv0.y) &&  uv0.x > (start - offset * uv0.y - width))
    {
        vec3 improve = strength * vec3(255, 255, 255);
        vec3 result = improve * vec3( src_color.r, src_color.g, src_color.b);
        gl_FragColor = vec4(result, src_color.a);

    }else{
        gl_FragColor = src_color;
    }
}
`
    },
    FluxaySuper: {
        vert: MVP,
        frag: 
`
#define TAU 6.12
#define MAX_ITER 5
uniform sampler2D texture;
uniform vec4 color;
uniform float time;
varying vec2 uv0;

void main()
{
    float time = time * .5+5.;
    // uv should be the 0-1 uv of texture...
    vec2 uv = uv0.xy;//fragCoord.xy / iResolution.xy;
    
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
    vec4 tex = texture2D(texture,uv);
    vec3 colour = vec3(pow(abs(c), 20.0));
    colour = clamp(colour + vec3(0.0, 0.0, .0), 0.0, tex.a);

    // 混合波光
    float alpha = c*tex[3];  
    tex[0] = tex[0] + colour[0]*alpha; 
    tex[1] = tex[1] + colour[1]*alpha; 
    tex[2] = tex[2] + colour[2]*alpha; 
    gl_FragColor = color * tex;
}
`
    },
    Pure: {
        vert: MVP,
        frag: 
`
uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;
void main () {
    vec4 c = color * texture2D(texture, uv0);
    gl_FragColor = vec4(color.rgb, c.a);
}
`
    },
    WaterWave: {
        vert: MVP,
        frag:
`
#define F cos(x-y)*cos(y),sin(x+y)*sin(y)

uniform sampler2D texture;
uniform float time;
uniform vec3 resolution;
varying vec2 uv0;

vec2 s(vec2 p)
{
    float d=time*0.2,x=8.*(p.x+d),y=8.*(p.y+d);
    return vec2(F);
}
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // 换成resolution
    vec2 rs = resolution.xy;
    // 换成纹理坐标v_texCoord.xy
    vec2 uv = uv0.xy;
    vec2 q = uv+2./resolution.x*(s(uv)-s(uv+rs));
    //反转y
    // q.y=1.-q.y;
    fragColor = texture2D(texture,q);
}
void main()
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`
    }
};

export default ShaderLab;
