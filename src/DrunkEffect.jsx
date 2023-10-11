import { BlendFunction, Effect } from "postprocessing";
import { Uniform } from "three";

const fragmentShader = /* GLSL */ `
    uniform float frequency;
    uniform float amplitude;
    uniform float offset;

    void mainUv(inout vec2 uv) {
        uv.y += sin(uv.x * frequency + offset) * amplitude;
    }


    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        // outputColor = vec4(uv, 1.0, 1.0);
        // vec4 color = inputColor;
        // color.rgb *= vec3(.8, 1.0, .5);

        // outputColor = color;
        outputColor = vec4(.8, 1.0, .5, inputColor.a);
    }
`;

export default class DrunkEffect extends Effect {
  constructor({ frequency = 10, amplitude = .1, blendFunction = BlendFunction.DARKEN }) {
    super("DrunkEffect", fragmentShader, {
      blendFunction,
      uniforms: new Map([
        // ["frequency", { value: frequency }],
        // ["amplitude", { value: amplitude }],
        /* ------- SAME  ------- */
        ["frequency", new Uniform(frequency)],
        ["amplitude", new Uniform(amplitude)],
        ["offset", new Uniform(0)],
      ]),
    });
  }
  update(renderer, inputBuffer, deltaTime) {
    this.uniforms.get("offset").value += deltaTime; 
  }
}