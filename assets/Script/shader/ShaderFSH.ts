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
const ShaderFSH = [
    {
        name: "GrayScaling",//灰度图
        vert: MVP,
        defines: [],
        frag: `
uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;
void main () {
    vec4 c = color * texture2D(texture, uv0);
    float gray = dot(c.rgb, vec3(0.299 * 0.5, 0.587 * 0.5, 0.114 * 0.5));
    gl_FragColor = vec4(gray, gray, gray, c.a * 0.5);
}
`
    },

    {
        name: "WaterWave",//水波
        vert: MVP,
        defines: [],
        frag: `
#define F cos(x-y)*cos(y),sin(x+y)*sin(y)

uniform sampler2D texture;
uniform float iTime;
uniform vec3 resolution;
varying vec2 uv0;

vec2 s(vec2 p)
{
    float d=iTime*0.2,x=8.*(p.x+d),y=8.*(p.y+d);
    return vec2(F);
}
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // 换成resolution
    vec2 rs = resolution.xy;
    // 换成纹理坐标 uv0
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
    },
    {
        name: "StartLighting",//封面的闪电
        vert: MVP,
        defines: [],
        frag: `
uniform float iTime;
uniform vec3 resolution;
varying vec2 uv0;

vec2 hash(in vec2 p)
{
  p=vec2(dot(p,vec2(127.1,311.7)),
  dot(p,vec2(269.5,183.3)));
  
  return-1.+2.*fract(sin(p)*43758.5453123);
}

float noise(in vec2 p)
{
  const float K1=.366025404;
  const float K2=.211324865;
  
  vec2 i=floor(p+(p.x+p.y)*K1);
  
  vec2 a=p-i+(i.x+i.y)*K2;
  vec2 o=step(a.yx,a.xy);
  vec2 b=a-o+K2;
  vec2 c=a-1.+2.*K2;
  
  vec3 h=max(.5-vec3(dot(a,a),dot(b,b),dot(c,c)),.0);
  
  vec3 n=h*h*h*h*vec3(dot(a,hash(i+.0)),
  dot(b,hash(i+o)),
  dot(c,hash(i+1.)));
  
  return dot(n,vec3(70.));
}

float fbm(in vec2 p,float time)
{
  float c=cos(time/sqrt(3.));
  float d=noise(p);
  d+=.5*noise(p+vec2(+c,+0.));
  d+=.25*noise(p+vec2(+0.,+c));
  d+=.125*noise(p+vec2(-c,+0.));
  d+=.0625*noise(p+vec2(+0.,-c));
  d/=(1.+.5+.25+.125+.0625);
  return.5+.5*d;
}

vec2 toPolar(in vec2 p)
{
  float r=length(p);
  float a=atan(p.y,p.x);
  return vec2(r,a);
}

vec2 toRect(in vec2 p)
{
  float x=p.x*cos(p.y);
  float y=p.x*sin(p.y);
  return vec2(x,y);
}



vec3 electric(in vec2 uv)
{
  const float thickness=.25;
  const float haze=2.5;
  const float size=.075;
  const int count=3;
  
  vec2 p=uv;
  
  vec2 pp=toPolar(p);
  pp.y+=.2*p.x;
  p=toRect(pp);
  
  vec3 col=vec3(0.);
  
  float a1=smoothstep(.05,1.,length(p-vec2(-.6,0.)));
  float a2=smoothstep(.05,1.,length(p-vec2(.6,0.)));
  float s1=1./(a1+.1)*1.1;
  float s2=1./(a2+.1)*1.1;
  
  float e1=1.6+.4*sin(iTime*sqrt(2.));
  float e2=e1;
  
  for(int i=0;i<count;++i)
  {
    float fi=float(i);
    float time=iTime+fi;
    float fe1=(pow(fi+1.,.2))*e1;
    float fe2=fe1;
    vec2 o1=1.5*time*vec2(0,-1);
    vec2 o2=o1;
    float d1=abs((p.y*haze)*thickness/(p.y-fe1*fbm(p+o1,time*.11)*a1))*s1;
    float d2=abs((p.y*haze)*thickness/(p.y-fe2*fbm(p+o2,time*.09)*a2))*s2;
    col+=d1*size*vec3(.1,.8,2.);
    col+=d2*size*vec3(2.,.1,.8);
  }
  
  col/=float(count-1);
  return col;
}

void mainImage(out vec4 fragColor,in vec2 fragCoord)
{
  vec2 uv=uv0.xy;
  uv.x=2.*uv.x-1.;
  uv.y=1.-2.*uv.y;
  uv.x*=resolution.x/resolution.y;

  vec3 col=electric(uv*2.);

  fragColor=vec4(col,1.);
}
void main()
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
        `
  },
  {
    name: "Blackhole",//黑洞
    vert: MVP,
    defines: [],
    frag: `
uniform vec3 resolution;
varying vec2 uv0;
#define f(a) exp(-10.*pow(length(U-.52*cos(a+vec2(0.0,33.0))), 2.))

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 rs = resolution.xy;
    vec2 U = (2.*uv0*rs-rs)/rs.y;
    // 翻转Y
    U.y=-U.y;
    
    fragColor = (.5-.5*cos(min(6.*length(U),6.3)))*(.7*vec4(1.,.25,0.0,.0)
    +(f(.65)+f(1.6)+f(2.8))*vec4(.8,.8,.5,0.))
    +vec4(vec3(.0),1.);//黑色背景
}
void main()
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
    `
  }
];


cc.game.once(cc.game.EVENT_ENGINE_INITED, function () {
    ShaderFSH.forEach((val) => {
        // shader模板定义 名字，顶点着色器，片段着色器，宏定义列表，引擎初始化完成即定义
        // @ts-ignore
        cc.renderer._forward._programLib.define(val.name, val.vert, val.frag, val.defines || []);
    })
});

export default ShaderFSH;