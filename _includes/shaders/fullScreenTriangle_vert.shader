in int id;
out vec2 v_uv;

void main() {
  v_uv = vec2(0.0, 0.0);
  v_uv.x = (id == 1) ? 2.0 : 0.0;
  v_uv.y = (id == 2) ? 0.0 : 2.0;
  gl_Position = vec4(v_uv * vec2(2.0, -2.0) + vec2(-1.0, 3.0), 0.0, 1.0);
}