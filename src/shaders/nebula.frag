precision mediump float;

uniform sampler2D uTexture;
uniform vec2 uResolution;    // texture or canvas size
uniform float uTime;
uniform float uAlpha;

varying vec2 vTextureCoord;

vec2 randomGradient(vec2 p) {
  float x = dot(p, vec2(123.4, 234.5));
  float y = dot(p, vec2(234.5, 345.6));
  vec2 gradient = vec2(x, y);
  gradient = sin(gradient);
  gradient = gradient * 43758.5453;
//   gradient = sin(gradient);
  gradient = sin(gradient + uTime);
  return gradient;
}

vec2 quintic(vec2 p) {
  return p * p * p * (10.0 + p * (-15.0 + p * 6.0));
}

vec3 purpleGradient(float t) {
    vec3 black = vec3(0.0, 0.0, 0.0);
    vec3 pink = vec3(1.0, 0.2, 0.8);
    vec3 purple = vec3(0.5, 0.0, 1.0);

    // Use smoothstep to favor black at low values
    // if (t < 0.3) {
        // return mix(purple, pink, (t - 0.3) / 0.7); // 0.3–1 → pink to purple
    // } else {
        return mix(pink, black, clamp(t / 0.8, 0.0, 1.0)); // first 0–0.3 → black to pink
    // }
}

float perlinNoise(vec2 uv) {
  vec2 gridId = floor(uv);
  vec2 gridUv = fract(uv);

  vec2 bl = gridId + vec2(0.0, 0.0);
  vec2 br = gridId + vec2(1.0, 0.0);
  vec2 tl = gridId + vec2(0.0, 1.0);
  vec2 tr = gridId + vec2(1.0, 1.0);

  vec2 g1 = randomGradient(bl);
  vec2 g2 = randomGradient(br);
  vec2 g3 = randomGradient(tl);
  vec2 g4 = randomGradient(tr);

  vec2 distFromBl = gridUv - vec2(0.0, 0.0);
  vec2 distFromBr = gridUv - vec2(1.0, 0.0);
  vec2 distFromTl = gridUv - vec2(0.0, 1.0);
  vec2 distFromTr = gridUv - vec2(1.0, 1.0);

  float d1 = dot(g1, distFromBl);
  float d2 = dot(g2, distFromBr);
  float d3 = dot(g3, distFromTl);
  float d4 = dot(g4, distFromTr);

  gridUv = quintic(gridUv);

  float bot = mix(d1, d2, gridUv.x);
  float top = mix(d3, d4, gridUv.x);
  float pNoise = mix(bot, top, gridUv.y);

  return pNoise + 0.1;
}

float fbmPerlinNoise(vec2 uv) {
    float fbmNoise = 0.0;
    float amplitude = 1.0;
    const float octaves = 5.0;

    for (float i = 0.0; i < octaves; i++) {
        fbmNoise = fbmNoise + perlinNoise(uv) * amplitude;
        amplitude = amplitude * 0.5;
        uv = uv * 2.0;
    }

    return fbmNoise;
}

void main() {
    vec2 uv = vTextureCoord;

    uv = uv * 12.0;
    float pNoise = fbmPerlinNoise(uv);
    float t = clamp(pNoise * 0.5 + 0.5, 0.0, 1.0);
    vec3 nebulaColour = purpleGradient(t);

    float starNoise = clamp(perlinNoise(uv * 60.0) * 0.5 + 0.5, 0.0, 1.0);
    float star = step(0.8, starNoise); // lower threshold → more stars

    // Subtle twinkle
    float twinkle = 0.9 + 0.1 * sin(uTime * 0.3 + starNoise * 20.0);

    // Star color: purple-tinted if in nebula, white in dark
    vec3 starColour = (t > 0.5) ? nebulaColour * 1.5 : vec3(1.0);

    vec3 finalColour = nebulaColour + star * starColour * twinkle;


    gl_FragColor = vec4(finalColour, 1) * uAlpha;
}