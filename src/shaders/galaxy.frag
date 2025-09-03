precision mediump float;

uniform sampler2D uTexture;
varying vec2 vTextureCoord;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
    vec4 color = texture2D(uTexture, vTextureCoord);
    float alphaMask = color.a;

    if(alphaMask < 0.01){
        gl_FragColor = vec4(0.0);
        return;
    }

    vec2 uv = vTextureCoord - vec2(0.5);
    float dist = length(uv);

    float depthFactor = smoothstep(0.0, 0.5, dist);
    float centerGlow = smoothstep(0.5, 0.0, dist);
    float edgeFade = smoothstep(0.8, 0.5, dist);

    vec3 baseColor = color.rgb * mix(1.0, 0.5, depthFactor);

    vec3 edgeTint = vec3(0.2, 0.1, 0.5);
    baseColor = mix(baseColor, edgeTint, depthFactor * 0.3);

    float noise = rand(vTextureCoord * 100.0);
    baseColor *= 0.95 + 0.05 * noise;
    baseColor += baseColor * 0.2 * centerGlow;
    baseColor += edgeFade * alphaMask * 0.1;
    baseColor *= alphaMask;

    gl_FragColor = vec4(baseColor, alphaMask);
}
