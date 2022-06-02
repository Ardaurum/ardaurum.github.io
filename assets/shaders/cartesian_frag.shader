uniform vec2 u_resolution;
uniform float u_time;

const float GRID_DIS = 0.05546;
const float HELP_SIZE = 0.004;
const float MAIN_SIZE = 0.001;

const float HELP_ABS_SIZE = HELP_SIZE / GRID_DIS;

void main() {
	vec2 st = gl_FragCoord.xy / u_resolution.xy;
	vec2 gridDis = fract(st / GRID_DIS) * 2.0 - 1.0;
	float helpPass = max(abs(gridDis.x - HELP_ABS_SIZE), abs(gridDis.y - HELP_ABS_SIZE));
	vec4 gridCol = mix(vec4(0.128, 0.156, 0.1875, 1.0), vec4(0.6, 0.61, 0.62, 1.0), smoothstep(0.84, 1.1, helpPass));

	float mainPassX = -abs(st.x * 2.0 - 1.0) + 1.0;
	float mainPassY = -abs(st.y * 2.0 - 1.0) + 1.0;
	gridCol = mix(gridCol, vec4(0.136, 0.484, 0.136, 1.0), smoothstep(0.985 - MAIN_SIZE, 1.0 - MAIN_SIZE, mainPassX));
	gridCol = mix(gridCol, vec4(0.433, 0.136, 0.136, 1.0), smoothstep(0.985 - MAIN_SIZE, 1.0 - MAIN_SIZE, mainPassY));

	gl_FragColor = gridCol;
}