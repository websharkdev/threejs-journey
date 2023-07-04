// uniform mat4 projectionMatrix;
// uniform mat4 viewMatrix;
// uniform mat4 modelMatrix;
// uniform vec2 uFrequency;
// uniform float uTime;

// attribute vec3 position;
// attribute vec2 uv;

// varying vec2 vUv;
// varying float vElevation;

// void main() {
//     vec4 modelPosition = modelMatrix * vec4(position, 1.0);

//     float elevation = sin(modelPosition.x * uFrequency.x - uTime - 1.0) * 0.1;
//     elevation += sin(modelPosition.y * uFrequency.y - uTime - 1.0) * 0.1;

//     modelPosition.z += elevation;


//     vec4 viewPosition = viewMatrix * modelPosition;
//     vec4 projectionPosition = projectionMatrix * viewPosition;

//     gl_Position = projectionPosition;

//     vUv = uv;
//     vElevation = elevation;
// }

uniform vec2 uFrequency;
uniform float uTime;

varying vec2 vUv;
varying float vElevation;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float elevation = sin(modelPosition.x * uFrequency.x - uTime - 1.0) * 0.1;
    elevation += sin(modelPosition.y * uFrequency.y - uTime - 1.0) * 0.1;

    modelPosition.z += elevation;


    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

    vUv = uv;
    vElevation = elevation;
}