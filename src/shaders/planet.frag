precision mediump float;

uniform sampler2D uTexture;
varying vec2 vTextureCoord;

// Hash-based random noise
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

// Smooth noise
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) +
           (c - a) * u.y * (1.0 - u.x) +
           (d - b) * u.x * u.y;
}

// Fractal Brownian Motion
float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
        v += a * noise(p);
        p *= 2.0;
        a *= 0.5;
    }
    return v;
}

void main() {
    // Sample base texture
    vec4 texColor = texture2D(uTexture, vTextureCoord);

    // Early out if texture pixel is already transparent
    if (texColor.a < 0.01) {
        discard;
    }

    // Remap UV from [0,1] → [-1,1]
    vec2 uv = (vTextureCoord - 0.5) * 2.0;

    // Circle mask
    float r = length(uv);
    if (r > 1.0) {
        discard; // clean edge, no border
    }

    // Fake lighting
    vec3 lightDir = normalize(vec3(-0.5, 0.5, 1.0));
    vec3 normal = normalize(vec3(uv, sqrt(1.0 - r*r)));
    float diffuse = clamp(dot(normal, lightDir), 0.0, 1.0);

    // Clouds
    vec2 cloudUV = uv * 3.0 + vec2(0.05, 0.0);
    float cloudNoise = fbm(cloudUV);
    float clouds = smoothstep(0.5, 0.8, cloudNoise);

    // Base planet color with lighting
    vec3 base = texColor.rgb * diffuse;

    // Mix in clouds
    vec3 cloudColor = mix(base, vec3(1.0), clouds * 0.4);

    gl_FragColor = vec4(cloudColor, 1.0);
}
