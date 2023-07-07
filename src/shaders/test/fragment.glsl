varying vec2 vUv;
#define M_PI 3.1415926535897932384

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43785.5453123);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid) {
    return vec2(
        cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
        cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}

vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}

vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 * 
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

void main() {
    // Pattern 3
    // float strength = vUv.x;
    // Pattern 4
    // float strength = vUv.y;
    // Pattern 5
    // float strength = 1.0 - vUv.y;
    // Pattern 6
    // float strength = vUv.y * 10.0;
    // Pattern 7
    // float strength = mod(vUv.y * 10.0, 1.0);

    // Pattern 8
    // float strength = mod(vUv.y * 10.0, 1.0);

    // if(strength < 0.5) {
    //     strength = 0.0;
    // } else {
    //     strength = 1.0;
    // }

    // if(strength < 0.5) strength = 0.0; else strength = 1.0;

    // strength = strength < 0.5 ? 0.0 : 1.0;

    // strength = step(0.5, strength);

    
    // Pattern 9
    // float strength = mod(vUv.y * 10.0, 1.0);
    // strength = step(0.8, strength);

    // Pattern 10
    // float strength = mod(vUv.x * 10.0, 1.0);
    // strength = step(0.8, strength);

    // Pattern 11 (GRID)
    // float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
    // strength += step(0.8, mod(vUv.y * 10.0, 1.0));

    // Pattern 12 (GRID)
    // float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
    // strength *= step(0.8, mod(vUv.y * 10.0, 1.0));

    // Pattern 13 (GRID)
    // float strength = step(0.8, mod(vUv.y * 10.0, 1.0)); (my variant)
    // strength -= step(0.8, mod(vUv.x * 10.0, 1.0));

    // float strength = step(0.4, mod(vUv.x * 10.0, 1.0));
    // strength *= step(0.8, mod(vUv.y * 10.0, 1.0));

    
    // Pattern 14 (GRID)
    // float barY = step(0.8, mod(vUv.x * 10.0, 1.0));
    // barY *= step(0.4, mod(vUv.y * 10.0, 1.0));

    // float barX = step(0.4, mod(vUv.x * 10.0, 1.0));
    // barX *= step(0.8, mod(vUv.y * 10.0, 1.0));
    
    // float strength = barY + barX;

    // Pattern 15 (PLUS)
    // float barY = step(0.4, mod(vUv.x * 10.0, 1.0)); (MY VARIANT)
    // barY *= step(0.8, mod(vUv.y * 10.0 + .2, 1.0));

    // float barX = step(0.8, mod(vUv.x * 10.0 + .2, 1.0));
    // barX *= step(0.4, mod(vUv.y * 10.0, 1.0));

    // float barX = step(0.4, mod(vUv.x * 10.0, 1.0));
    // barX *= step(0.8, mod(vUv.y * 10.0 + .2, 1.0));

    // float barY = step(0.8, mod(vUv.x * 10.0 + 0.2, 1.0)); 
    // barY *= step(0.4, mod(vUv.y * 10.0 , 1.0));
    // float strength = barY + barX;

    // Pattern 16 (GRADIENT)    
    // float strength = abs(vUv.x - .5);

    // Pattern 17 (GRADIENT)    
    // float strength = min(abs(vUv.x - .5), abs(vUv.y - .5));

    // Pattern 18 (GRADIENT)    
    // float strength = max(abs(vUv.x - .5), abs(vUv.y - .5))
    ;
    // Pattern 19 (GRADIENT)    
    // float strength = step(.2, max(abs(vUv.x - .5), abs(vUv.y - .5)));
    
    // Pattern 20 (GRADIENT)    
    // float strength = step(.4, max(abs(vUv.x - .5), abs(vUv.y - .5))); // (my variant)

    // float square1 = step(0.2, max(abs(vUv.x - .5), abs(vUv.y - .5)));
    // float square2 = 1.0 - step(0.25, max(abs(vUv.x - .5), abs(vUv.y - .5)));
    // float strength = square1 * square2;
    
    
    // Pattern 21 (FLOAT GRADIENT) 
    // float strength = floor(vUv.x * 10.0) / 10.0;

    // Pattern 22 (FLOAT GRADIENT) 
    // float strength = floor(vUv.x * 10.0) / 10.0;
    // strength *= floor(vUv.y * 10.0) / 10.0;

    // Pattern 23 (NOISE) 
    // float strength = random(vUv);

    // Pattern 24 (NOISE) 
    // vec2 gridUV = vec2(floor(vUv.x * 10.0) / 10.0, floor(vUv.y * 10.0) / 10.0);
    // float strength = random(gridUV);

    // Pattern 25 (NOISE) 
    // vec2 gridUV = vec2(floor(vUv.x * 10.0) / 10.0, floor((vUv.y + vUv.x * .5) * 10.0) / 10.0);
    // float strength = random(gridUV);

    // Pattern 26 (GRADIENT) 
    // float strength = length(vUv);

    // Pattern 27 (GRADIENT) 
    // float strength = length(vUv - .5);
    // float strength = distance(vUv, vec2(.5));

    // Pattern 28 (GRADIENT) 
    // float strength = 1.0 - distance(vUv, vec2(.5));

    // Pattern 29 (GRADIENT) 
    // float strength = 0.025 / distance(vUv, vec2(.5));

    // Pattern 30
    // vec2 lightUv = vec2(
    //  vUv.x * 0.1  + .45,
    //  vUv.y * .5 + .25
    // );

    // float strength = .015 / distance(lightUv, vec2(.5));

    // Pattern 31
    // vec2 lightUvX = vec2(
    //     vUv.x * 0.1  + .45,
    //     vUv.y * .5 + .25
    // );

    // float lightX = .015 / distance(lightUvX, vec2(.5));

    // vec2 lightUvY = vec2(
    //     vUv.y * 0.1  + .45,
    //     vUv.x * .5 + .25
    // );

    // float lightY = .015 / distance(lightUvY, vec2(.5));

    // float strength = lightX * lightY;

    // Pattern 32
    // vec2 rotatedUv = rotate(vUv, M_PI * .25, vec2(0.5));

    // vec2 lightUvX = vec2(
    //     rotatedUv.x * 0.1 + .45,
    //     rotatedUv.y * .5 + .25
    // );

    // float lightX = .015 / distance(lightUvX, vec2(.5));

    // vec2 lightUvY = vec2(
    //     rotatedUv.y * 0.1 + .45,
    //     rotatedUv.x * .5 + .25
    // );

    // float lightY = .015 / distance(lightUvY, vec2(.5));

    // float strength = lightX * lightY;

    // Pattern 33
    // float strength = step(.25, distance(vUv, vec2(.5)));

    // Pattern 34
    // float strength = abs(distance(vUv, vec2(.5)) - .25);

    // Pattern 35
    // float strength = step(.01, abs(distance(vUv, vec2(.5)) - .25));

    // Pattern 36
    // float strength = 1.0 - step(.01, abs(distance(vUv, vec2(.5)) - .25));

    // Pattern 37
    // vec2 wavedUv = vec2(
    //     vUv.x,
    //     vUv.y + sin(vUv.x * 30.0) * .1
    // );
    
    // float strength = 1.0 - step(.01, abs(distance(wavedUv, vec2(.5)) - .25));

    // Pattern 38
    // vec2 wavedUv = vec2(
    //     vUv.x + sin(vUv.y * 30.0) * .1,
    //     vUv.y + sin(vUv.x * 30.0) * .1
    // );
    
    // float strength = 1.0 - step(.01, abs(distance(wavedUv, vec2(.5)) - .25));

    // Pattern 39
    // vec2 wavedUv = vec2(
    //     vUv.x + sin(vUv.y * 100.0) * .1,
    //     vUv.y + sin(vUv.x * 100.0) * .1
    // );
    
    // float strength = 1.0 - step(.01, abs(distance(wavedUv, vec2(.5)) - .25));

    // Pattern 40    
    // float angle = atan(vUv.x, vUv.y);
    // float strength = angle;

    // Pattern 41
    // float angle = atan(vUv.x - .5, vUv.y - .5);
    // float strength = angle;

    // Pattern 42
    // float angle = atan(vUv.x - .5, vUv.y - .5);
    // angle /= M_PI * 2.0;
    // angle += .5;
    // float strength = angle;

    // Pattern 43
    // float angle = atan(vUv.x - .5, vUv.y - .5);
    // angle /= M_PI * 2.0;
    // angle += .5;
    // angle *= 5.0;
    // angle = mod(angle, 1.0);
    // float strength = angle;

    // Pattern 44
    // float angle = atan(vUv.x - .5, vUv.y - .5);
    // angle /= M_PI * 2.0;
    // angle += .5;
    // angle = mod(angle, 1.0);
    // float strength = sin(angle * 100.0);

    // Pattern 45
    // float angle = atan(vUv.x - .5, vUv.y - .5);
    // angle /= M_PI * 2.0;
    // angle += .5;
    // float sinusoid = sin(angle * 100.0);

    // float radius = .25 + sinusoid * .02;
    // float strength = 1.0 - step(.01, abs(distance(vUv, vec2(.5)) - radius));

    // Pattern 46
    // float strength = cnoise(vUv * 10.0);

    // Pattern 47
    // float strength = step(.0, cnoise(vUv * 10.0));
    // float strength = 1.0 - step(.0, cnoise(vUv * 10.0));

    // Pattern 48
    // float strength = 1.0 - abs(cnoise(vUv * 20.0));

    // Pattern 49
    // float strength = step(.9, sin(cnoise(vUv * 10.0) * 20.0));

    // Pattern 50 (COLORS)
    // float strength = step(.9, sin(cnoise(vUv * 10.0) * 20.0));

    // CLAMP THE STRENGTH

    float strength = step(.9, sin(cnoise(vUv * 10.0) * 20.0));
    strength = clamp(strength, .0, 1.0);

    vec3 blackColor = vec3(.0);
    vec3 uvColor = vec3(vUv, 1.0);

    vec3 mixedColor = mix(blackColor, uvColor, strength);

    gl_FragColor = vec4(mixedColor, 1.0);

    // TRIENGLE
    
    // float strength = mod(vUv.x, 1.0);
    // strength = step(vUv.y, strength);

    // float strength = step(vUv.y, mod(vUv.x * 10.0, 1.0));
    // gl_FragColor = vec4(strength, strength, strength, 1.0);
}