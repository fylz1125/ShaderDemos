#ifdef GL_ES
precision mediump float;
#endif
uniform float mode;//0普通模糊 1高斯模糊 2动感模糊
uniform vec2 resolution;
uniform float GlowRange; //模糊半径
uniform float GlowExpand; //动感模糊角度
varying vec4 v_fragmentColor;
varying vec2 v_texCoord;
void main()                      
{    
     vec4 clraverge = vec4(0,0,0,0);                               
     if( GlowRange > 0.0 )                         
     {   
        if(mode==2)
        {
          float samplerPre =1;                               
          float range=GlowRange*3;
          float rad=GlowExpand;
            for( float j = 1; j<=range ; j += samplerPre )  
            {  
              float dx = 0.002*cos( rad );
              float dy = 0.002*sin( rad );
              vec2  samplerTexCoord = vec2( v_texCoord.x + j*dx, v_texCoord.y+j*dy );  
              vec2 samplerTexCoord1 = vec2( v_texCoord.x - j*dx,v_texCoord.y-j*dy );        
              if( samplerTexCoord.x < 0.0 || samplerTexCoord.x > 1.0 
                  ||samplerTexCoord1.x < 0.0 || samplerTexCoord1.x > 1.0
                  ||samplerTexCoord.y < 0.0 || samplerTexCoord.y > 1.0 
                  ||samplerTexCoord1.y < 0.0 || samplerTexCoord1.y > 1.0)
                {
                  continue;
                }
                vec4 tc= texture2D( CC_Texture0, samplerTexCoord );
                vec4 tc1= texture2D( CC_Texture0, samplerTexCoord1 );
                clraverge+=tc; 
                clraverge+=tc1;      
            } 
            clraverge/=(range*2);
        }
        else
        {  
          float samplerPre = 3.0;
          float radiusX = 1.0 / TextureSize.x;             
          float radiusY = 1.0 / TextureSize.y;         
          float count = 0.0;   
          float  range=GlowRange*2.0;
          for( float i = -range ; i <= range ; i += samplerPre )                                                            
            {
              for( float j = -range ; j <= range ; j += samplerPre )                                                        
              {    
                float nx=j;
                float ny=i;
                float q=range/1.75;
                float  gr=(1.0/(2*3.14159*q*q))*exp(-(nx*nx+ny*ny)/(2*q*q))*9.0;   
                vec2 samplerTexCoord = vec2( v_texCoord.x + j * radiusX , v_texCoord.y + i * radiusY );  
                if( samplerTexCoord.x < 0.0)
                  samplerTexCoord.x=-samplerTexCoord.x;
                else if(samplerTexCoord.x > 1.0)
                  samplerTexCoord.x =2-samplerTexCoord.x;

                if(samplerTexCoord.y < 0.0)
                  samplerTexCoord.y=-samplerTexCoord.y;
                else if(samplerTexCoord.y > 1.0)
                  samplerTexCoord.y =2-samplerTexCoord.y;

                vec4 tc= texture2D( CC_Texture0, samplerTexCoord ); 
                if(mode==0)
                   clraverge+=tc;  
                else  if(mode==1)
                   clraverge+=tc*gr;  
                count+=1;    
              }       
            }  
            if(mode==0)
              clraverge/=count;   
        } 
    }  
    gl_FragColor =clraverge;
}