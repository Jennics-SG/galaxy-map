precision mediump float;

uniform sampler2D uTexture;
varying vec2 vTextureCoord;

// Simple noise for subtle volumetric feel
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
    // Sample texture
    vec4 color = texture2D(uTexture, vTextureCoord);
    float alphaMask = color.a;

    // Early out: discard fully transparent pixels (optional)
    if(alphaMask < 0.01){
        gl_FragColor = vec4(0.0);
        return;
    }

    // Distance from center
    vec2 uv = vTextureCoord - vec2(0.5);
    float dist = length(uv);

    // Depth factor: center bright, edges dim
    float depthFactor = smoothstep(0.0, 0.5, dist);

    // Center glow
    float centerGlow = smoothstep(0.5, 0.0, dist);

    // Edge diffusion
    float edgeFade = smoothstep(0.8, 0.5, dist);

    // Base color modulated by depth
    vec3 baseColor = color.rgb * mix(1.0, 0.5, depthFactor);

    // Optional subtle tint for edges
    vec3 edgeTint = vec3(0.2, 0.1, 0.5);
    baseColor = mix(baseColor, edgeTint, depthFactor * 0.3); // reduced tint

    // Add subtle volumetric variation
    float noise = rand(vTextureCoord * 100.0);
    baseColor *= 0.95 + 0.05 * noise;

    // Apply center glow
    baseColor += baseColor * 0.2 * centerGlow;

    // Apply edge diffusion (scaled down)
    baseColor += edgeFade * alphaMask * 0.1;

    // Multiply by alpha to prevent drawing outside PNG
    baseColor *= alphaMask;

    gl_FragColor = vec4(baseColor, alphaMask);
}
