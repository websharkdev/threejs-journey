varying vec2 vUv;
uniform vec3 uSurfaceColor;
uniform vec3 uDepthColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vElevation;

void main() {
    float mixStrentgth = vElevation * uColorMultiplier + uColorOffset;

    vec3 color = mix(uDepthColor, uSurfaceColor, mixStrentgth);
    gl_FragColor = vec4(color, 1.0);
}