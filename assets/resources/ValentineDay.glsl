
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
varying vec2 v_texCoord;
// Camera constants

const float kFOV = 0.785398;                           // Camera field of view 

// RayMarching constants

const int kMaxSteps = 70;                              // Max number of raymarching steps
const float kMaxDistance = 55.0;                       // Max raymarching distance
const float kBias = 0.01;                              // Bias offset for normal estimation
const float kNoHit = -1.0;                             // No intersection distance.

// Scene constants.
const vec3 kSkyColor = vec3(0.1, 0.12, 0.15);          // Night sky color.
const vec3 kSkyHorzColor = vec3(0.4, 0.2, 0.87);       // Night sky horizon color.

const vec3 kMoonDir = vec3(-0.18443, 0.3688, -0.9221); // Moon direction.
const vec3 kMoonColor = vec3(1.0, 1.0, 0.8);           // Moon color.
const vec3 kMoonSkyByColor = vec3(0.9, 0.6, 1.2);      // Moon glow color.
const float kMoonCosRange = 0.999;                     // Moon cosine range.

// Material constants.
const float kMaterialNone = 0.0;
const float kMaterialHeart = 1.0;
const float kMaterialWater = 2.0;

// Other constants

const vec3 kOnes = vec3(1.0, -1.0, 0.0);               // Helper vector with ones.
const float kPI = 3.14159265359;                       // PI

// -- Global values ------------------------------------------------------------

float gAnimTime;

vec3  gHeartPos;
float gHeartMorph;
float gHeartColoring;

float gWaveTime;

float gMsgFadeInTime;
float gFadeTime;


// -- Structures ---------------------------------------------------------------

struct Ray
{
    vec3 origin;
    vec3 direction;
};

struct RayHit
{
    float rtime;
    float material;
};

struct DistanceSample
{
    float dist;
    float stepRatio;
    float material;
};

    
// --- Math funcs --------------------------------------------------------------

// Build quaternion from axis angle
vec4 QuatFromAxisAngle(vec3 axis, float angle)
{
    float theta = 0.5 * angle;
    float sine = sin(theta);
    return vec4(sin(theta) * axis, cos(theta));
}

// Builds the conjugate quaternion
vec4 QuatConjugate(vec4 q)
{
    return vec4(q.xyz, -q.w);
}

// Rotates a vector around the quaternion
vec3 QuatTransformVec(vec3 v, vec4 q)
{
    vec3 t = 2.0 * cross(q.xyz, v);
    return v + q.w * t + cross(q.xyz, t);
}

// -- Noise funcs --------------------------------------------------------------

// Hash noise function from I. Quilez
float Hash(float p)
{
    float h = p * 127.1;
    return fract(sin(h)*43758.5453123);
}

// Hash noise function from I. Quilez
float Hash(vec2 p)
{
    float h = dot(p, vec2(127.1,311.7));    
    return fract(sin(h)*43758.5453123);
}

// Modified Hash noise function for 3D hashing.
float Hash(vec3 p)
{
    float h = dot(p, vec3(127.1, 311.7, 511.9));    
    return fract(sin(h)*43758.5453123);
}

// 2D Perlin Noise
float PerlinNoise(vec2 p)
{    
    vec2 i = floor(p);
    vec2 f = fract(p);  
    vec2 u = smoothstep(0.0, 1.0, f);
    
    float f00 = mix(Hash(i + kOnes.zz), Hash(i + kOnes.xz), u.x);
    float f01 = mix(Hash(i + kOnes.zx), Hash(i + kOnes.xx), u.x);
    float f1 = mix(f00, f01, u.y);
    
    return 2.0 * f1 - 1.0;
}

// 3D Perlin Noise
float PerlinNoise(vec3 p)
{    
    vec3 i = floor(p);
    vec3 f = fract(p);  
    vec3 u = smoothstep(0.0, 1.0, f);
    
    float f00 = mix(Hash(i + kOnes.zzz), Hash(i + kOnes.xzz), u.x);
    float f01 = mix(Hash(i + kOnes.zxz), Hash(i + kOnes.xxz), u.x);
    float f02 = mix(Hash(i + kOnes.zzx), Hash(i + kOnes.xzx), u.x);
    float f03 = mix(Hash(i + kOnes.zxx), Hash(i + kOnes.xxx), u.x);
    
    float f10 = mix(f00, f01, u.y);
    float f11 = mix(f02, f03, u.y);
    
    float f2 = mix(f10, f11, u.z);
    
    return 2.0 * f2 - 1.0;
}

// Fractional Brownian Motion from I. Quilez
// http://www.iquilezles.org/www/articles/warp/warp.htm
// In the end, it's a sum of Perlin Noise functions with increasing frequencies
// and decreasing amplitudes. To enhance the noise, a rotation matrix is applied
// at each step.

const mat2 FBM_M2 = mat2(0.84147, 0.54030, 0.54030, -0.84147);
const mat3 FBM_M3 = mat3(0.00, 0.90, 0.60, -0.90, 0.36, -0.48, -0.60, -0.48, 0.34 );

float FBM(vec2 p)
{
    float f = 0.0;
    f += 0.5000*PerlinNoise(p); p = FBM_M2 * p * 2.02;
    f += 0.2500*PerlinNoise(p); p = FBM_M2 * p * 2.03;
    f += 0.1250*PerlinNoise(p); p = FBM_M2 * p * 2.01;
    //f += 0.0625*PerlinNoise(p);
    //return f/(0.9375);
    return f/(0.8750);
}

float FBM(vec3 p)
{
    float f = 0.0;
    f += 0.5000*PerlinNoise(p); p = FBM_M3 * p * 2.02;
    f += 0.2500*PerlinNoise(p); p = FBM_M3 * p * 2.33;
    f += 0.1250*PerlinNoise(p); p = FBM_M3 * p * 2.01;
    f += 0.0625*PerlinNoise(p); 
    return f/(0.9175);
}

// -- Camera funcs -------------------------------------------------------------

Ray ViewportToRay(vec2 uv, vec3 offs, vec4 rot)
{
    Ray ray;
    ray.direction = QuatTransformVec(normalize(vec3(uv * tan(kFOV * 0.5), -1.0)), rot);
    ray.origin = offs;
    
    return ray;
}

Ray ReflectRay(Ray ray, float d, vec3 n)
{
    ray.origin += ray.direction * d;
    ray.direction = reflect(ray.direction, n);
    return ray;
}

DistanceSample NewDistanceSample(float d, float s, float m)
{
    DistanceSample h;
    h.dist = d;
    h.stepRatio = s;
    h.material = m;
    return h;
}

RayHit NewRayHit(float t, float m)
{
    RayHit h;
    h.rtime = t;
    h.material = m;
    return h;
}

// -- Water funcs --------------------------------------------------------------

// Computes the height of a wave at the specified point
float WaveDirectional(vec2 p, float wavelength, float speed, vec2 direction, float amplitude)
{
    float freq = 2.0 * kPI / wavelength;
    float phase = speed * freq;
    float theta = dot(direction, p);

    return amplitude * pow(sin(theta * freq + gAnimTime * phase), 3.0);
}

float WavePunctual(vec2 p, float wavelength, float speed, vec2 perturb, float amplitude, float waveTime)
{
    float freq = 2.0 * kPI / wavelength;
    float phase = speed * freq;
    float dist = -length(p - perturb);
    amplitude /= 1.0 + (0.3 * -dist) + (0.15 * waveTime * waveTime);

    return amplitude * pow(sin(max(0.0, dist * freq + waveTime * phase)), 3.0);
}

// -- SDF funcs ----------------------------------------------------------------

// Signed Distance Field of a point to a heart located at the origin. It works by computing
// the SDF of a sphere whose space has been distorted by a polar function
DistanceSample SDFHeart(vec3 p)
{
    // Apply noise to position when it's a drop.
    if (gHeartMorph < 1.0)
        p += 0.16 * FBM(p + vec3(0, gAnimTime * 2.5, 0)) * (1.0 - gHeartMorph);
    
    // Apply domain distortion for heart.
    float a0 = atan(p.x, p.y);
    float a1 = atan(p.x, p.z);
    float b0 = abs(a0 / kPI);
    float b1 = abs(a1);
    float l = length(p.xy);
    
    // Constants computed with Octave:
    // x = [   0; 0.35;  0.53;   1; ];
    // y = [ 0.6;  1.0;  0.9; 1.2; ];
    // K = polyfit(x, y, 3);
    const vec4 K = vec4(6.34975, -9.8705, 4.39112, 0.4);
    vec4 B = vec4(b0 * b0 * b0, b0 * b0, b0, 1.0);
    
    float d0 = dot(K, B);
    d0 = mix(1.0, d0, smoothstep(0.0, 0.7, l));
    float d1 = 1.0 - 0.5*abs(cos(a1));
    
    p.xy /= mix(1.0, d0, gHeartMorph);
    p.z  /= mix(1.0, d1, gHeartMorph);
    
    // Increase size whenever the mouse is close.
	float mouseOverSize = 1.0+0.7*smoothstep(0.2, 0.0, length(1. - 0.5));
	
    // Compute sphere's SDF
    return NewDistanceSample(length(p) - 0.8 - 0.5 * gHeartMorph * mouseOverSize, 0.5, kMaterialHeart);
}

// Signed Distance Field of a point to the water plane located at the origin.
// It's simply the distance to a plane distorted by the wave field.
DistanceSample SDFWater(vec3 p)
{
    const float overallSpeed = 0.7;
    float height = 0.0;
    height -= FBM(vec3(p.xz * 0.5, 0.75 * gAnimTime)) * 0.05;
    height += WavePunctual(p.xz, 12.0, 1.5, vec2(0.0, -12.0), 2.0, gWaveTime);
    
    return NewDistanceSample(p.y - 1.5 * height, 1.0, kMaterialWater);
}

// -- SDF CGS funcs ------------------------------------------------------------

DistanceSample OpUnion(DistanceSample d1, DistanceSample d2)
{
    if (d1.dist < d2.dist) return d1; return d2;
}

DistanceSample OpSubstract(DistanceSample d1, DistanceSample d2)
{
    d2.dist = -d2.dist;
    if (d1.dist > d2.dist) return d1; return d2;
}

DistanceSample OpIntersect(DistanceSample d1, DistanceSample d2)
{
    if (d1.dist > d2.dist) return d1; return d2;
}

DistanceSample OpSmoothMin(DistanceSample d1, DistanceSample d2, float k)
{
    float h = clamp(0.5+0.5*(d2.dist - d1.dist)/k, 0.0, 1.0);
    
    DistanceSample d;
    d.dist = mix(d2.dist, d1.dist, h) - k * h * (1.0-h);
    d.stepRatio = min(d2.stepRatio, d1.stepRatio);
    d.material = mix(d2.material, d1.material, h);
    
    return d;
}

// -- Transform funcs ----------------------------------------------------------

vec3 Tx(vec3 p, vec3 tx)
{
    return (p - tx);
}

vec3 Tx(vec3 p, vec3 tx, vec4 q)
{
    p -= tx;
    return QuatTransformVec(p, QuatConjugate(q));
}

// --- Scene funcs -------------------------------------------------------------

DistanceSample Scene(vec3 position)
{
    // Evaluate scene distances.
    DistanceSample d0 = SDFHeart(Tx(position, gHeartPos, QuatFromAxisAngle(vec3(0.,1.,0.), gAnimTime*1.7)));
    DistanceSample d1 = SDFWater(Tx(position, vec3(0,-2,0)));
    return OpSmoothMin(d0, d1, 0.8);
}

vec3 SceneNormal(vec3 position)
{
    vec2 offset = vec2(kBias, 0.0);
    float d = Scene(position).dist;
    
    return normalize(vec3
    (
        Scene(position + offset.xyy).dist - d,
        Scene(position + offset.yxy).dist - d,
        Scene(position + offset.yyx).dist - d
    ));
}

vec3 SkyColor(vec3 n)
{
    // Compute the sky color from hemisphere. 
    float h = 1.0 - pow(abs(n.y), 0.4);
    vec3 color = mix(kSkyColor, kSkyHorzColor, h);
    
    // Add stars.
    float s = pow(max(0.0, PerlinNoise(n * 4e2)), 18.0);
    color.rgb += vec3(s, s, s);
    
    // Add moon and moon light.
    float dotNM = dot(n, kMoonDir);
    color = mix(color, kMoonColor, smoothstep(0.0, 0.0001, dotNM - kMoonCosRange));
    color += kMoonSkyByColor * pow(max(0.0, dotNM), 100.0);
    
    return color;
}

RayHit Raymarch(Ray ray)
{
    float t = 0.0;
    DistanceSample d;
    
    for (int i = 0; (i < kMaxSteps); i++)
    {
        d = Scene(ray.origin + ray.direction * t);
        t += d.dist * d.stepRatio;
        
        if ((d.dist < 0.0) || (t >= kMaxDistance))
            break;
    }
    
    if (t < kMaxDistance)
        return NewRayHit(t, d.material);
    
    return NewRayHit(kNoHit, kMaterialNone);
}

float SparkCircle(vec2 uv, vec2 center, float rad)
{
    float d = length(uv - center);
    return smoothstep(rad, 0.0, d);
}

float SparkRect(vec2 uv, vec2 center, vec2 size, float ang)
{
    vec2 cs = vec2(cos(ang), sin(ang));
    uv -= center;
    uv = vec2(dot(uv, cs), dot(uv.yx * vec2(-1.0, 1.0), cs));
    
    vec2 x = smoothstep(size*0.5, vec2(0.0, 0.0), abs(uv));
    return pow(x.x * x.y, 3.0);
}

float Spark(vec2 uv, vec2 center, float ang)
{
    float f = 0.0;
    f += SparkRect(uv, center, vec2(0.4, 0.008), ang);
    f += SparkRect(uv, center, vec2(0.4, 0.008), ang+radians(60.0));
    f += SparkRect(uv, center, vec2(0.4, 0.008), ang+radians(120.0));
    f += SparkCircle(uv, center, 0.01);
    return f;
} 

vec3 Colorize(Ray ray, RayHit hit)
{
    vec3 color = vec3(0.0, 0.0, 0.0);   
    color.rgb = SkyColor(ray.direction);
    
    // If there was an intersection, compute normal and the hit surface color.
    if (hit.material != kMaterialNone)
    {
        vec3 p = ray.direction * hit.rtime + ray.origin;
        vec3 n = SceneNormal(p);
        
        color.rgb = mix(vec3(0.0, 0.0, 0.0), SkyColor(reflect(ray.direction, n)), 1.0 - pow(length(n.xz), 16.0));
        
        if (hit.material == kMaterialHeart)
        {
            color.rgb += gHeartColoring * vec3(0.4, 0, 0);
        }
        
        //color.rgb = SceneNormal(p);//0.3 + 0.7*pow(max(0., Normal(p).z), 30.0);
    }
    
    return color;
}
                        
// --- Main --------------------------------------------------------------------

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
	// Setup globals.
	gAnimTime      = mod(1.5 * time, 20.0);
	gHeartPos      = vec3(0.0, -3.5 + 5.0 * smoothstep(1.0, 3.0, gAnimTime), -12.0);
	gHeartMorph    = smoothstep(2.5, 4.0, gAnimTime);
	gHeartColoring = smoothstep(4.0, 6.0, gAnimTime);
	gWaveTime      = max(0.0, gAnimTime - 0.8);
	gMsgFadeInTime = smoothstep(7.0, 9.0, gAnimTime);
	gFadeTime      = smoothstep(0.0, 1.0, gAnimTime) * smoothstep(20.0, 19.0, gAnimTime);

    // Get uvs in [-1 1] range and correct them with the aspect ratio.
    // vec2 uv = 2.0*(fragCoord.xy / resolution.xy)-1.0;
    vec2 ruv = 2.0*v_texCoord - 1.0;
    // 反转y坐标
    vec2 uv = vec2(ruv.x, - ruv.y);
    uv *= vec2(resolution.x / resolution.y, 1.0);
    
    // Generate first ray and raymarch along scene.
    Ray ray = ViewportToRay(uv, kOnes.zzz, QuatFromAxisAngle(vec3(1.0, 0.0, 0.0), radians(6.0)));
    RayHit hit = Raymarch(ray);    

    // Initialize background color.
    vec3 color = Colorize(ray, hit);
    
    // Show sparks around the heart
    for(int i = 0; i < 8; i++)
    {
        float t = max(0.0, (gAnimTime + (float(i)) * 0.2) - 6.0);
        float s = floor(t / 0.4);
        float sTime = fract(t / 0.4);
        vec2 sPos = vec2(Hash(s * 61.0), Hash(s * 17.0));
        sPos = 2.0 * sPos - 1.0;
        sPos *= 0.15;
        color.rgb += sin(sTime * kPI) * Spark(uv, sPos, 0.0) * vec3(1.0, 0.4, 0.4);
    }
    
    float ratio = .5 * resolution.y/resolution.x;
    // Apply vignetting effect.
    color.rgb -= color.rgb*ratio*dot(uv, uv);

    fragColor = vec4(gFadeTime * color, 1.0);
}


void main()
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
