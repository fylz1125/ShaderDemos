#ifdef GL_ES
precision mediump float;
#endif

// uniform float mode;//0普通模糊 1高斯模糊 2动感模糊
// uniform vec2 resolution;
// uniform float GlowRange; //模糊半径
// uniform float GlowExpand; //动感模糊角度
#define GlowRange 3.0
// varying vec4 v_fragmentColor;
// varying vec2 gl_FragCoord;
void main()                      
{  const float mode=1.0;
  // const float GlowRange=10.0;
  const float GlowExpand = 2.0;
    vec4 clraverge = vec4(0,0,0,0);                               
    if( GlowRange > 0.0 )
    {   
        if(mode==2.0)
        {
        float samplerPre =1.0;                               
        float range = GlowRange*3.0;
        float rad=GlowExpand;
            for( float j = 1.0; j<=range ; j += samplerPre )  
            {  
            float dx = 0.002*cos( rad );
            float dy = 0.002*sin( rad );
            vec2  samplerTexCoord = vec2( gl_FragCoord.x + j*dx, gl_FragCoord.y+j*dy );  
            vec2 samplerTexCoord1 = vec2( gl_FragCoord.x - j*dx,gl_FragCoord.y-j*dy );        
            if( samplerTexCoord.x < 0.0 || samplerTexCoord.x > 1.0 
                ||samplerTexCoord1.x < 0.0 || samplerTexCoord1.x > 1.0
                ||samplerTexCoord.y < 0.0 || samplerTexCoord.y > 1.0 
                ||samplerTexCoord1.y < 0.0 || samplerTexCoord1.y > 1.0)
                {
                continue;
                }
                vec4 tc= texture2D( iChannel0, samplerTexCoord );
                vec4 tc1= texture2D( iChannel0, samplerTexCoord1 );
                clraverge+=tc; 
                clraverge+=tc1;      
            } 
            clraverge/=(range*2.0);
        }else{  
        float samplerPre = 3.0;
        float radiusX = 1.0 / iResolution.x;             
        float radiusY = 1.0 / iResolution.y;         
        float count = 0.0;   
        float range1 = GlowRange*2.0;
        for( float i = -3.0 ; i <= 6.0 ; i += 1.0 )                                                            
            {
            for( float j = -3.0 ; j <= 6.0 ; j += 1.0 )                                                        
            {    
                float nx=j;
                float ny=i;
                float q=range1/1.75;
                float  gr=(1.0/(2.0*3.14159*q*q))*exp(-(nx*nx+ny*ny)/(2.0*q*q))*9.0;   
                vec2 samplerTexCoord = vec2( gl_FragCoord.x + j * radiusX , gl_FragCoord.y + i * radiusY );  
                if( samplerTexCoord.x < 0.0)
                samplerTexCoord.x=-samplerTexCoord.x;
                else if(samplerTexCoord.x > 1.0)
                samplerTexCoord.x =2.0-samplerTexCoord.x;

                if(samplerTexCoord.y < 0.0)
                samplerTexCoord.y=-samplerTexCoord.y;
                else if(samplerTexCoord.y > 1.0)
                samplerTexCoord.y =2.0-samplerTexCoord.y;

                vec4 tc= texture2D( iChannel0, samplerTexCoord ); 
                if(mode==0.0)
                clraverge+=tc;  
                else  if(mode==1.0)
                clraverge+=tc*gr;  
                count+=1.0;    
            }       
            }  
            if(mode==0.0)
            clraverge/=count;   
        } 
    }  
    gl_FragColor =clraverge;
}