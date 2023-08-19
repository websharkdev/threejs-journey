varying vec3 vColor;



void main() {

  // // DISC

  // float strength = distance(gl_PointCoord, vec2(.5));
  // strength = 1.0 - step(.5, strength);

  // DIFFUSE

  // float strength = distance(gl_PointCoord, vec2(.5));
  // strength *= 2.0;
  // strength *= 1.0 - strength;

  // LIGHT POINT

  float strength = distance(gl_PointCoord, vec2(.5));
  strength = 1.0 - strength;
  strength = pow(strength, 10.0);

  // FINAL

  vec3 color = mix(vec3(0.0), vColor, strength);

  gl_FragColor = vec4(color, 1.0);
}