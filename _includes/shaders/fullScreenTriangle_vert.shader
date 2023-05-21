out vec2 v_uv;

void main() {
  v_uv = vec2(gl_VertexID & 2, (gl_VertexID << 1) & 2);
  gl_Position = vec4(v_uv * vec2(2.0, -2.0) + vec2(-1.0, 1.0), 0.0, 1.0);
}