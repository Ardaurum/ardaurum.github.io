uniform vec2 u_resolution;
uniform float u_time;

in vec2 v_uv;

const float PI = 3.14;

const float ANGLE_SPEED = 1.8;
const float SPIRAL_REPEAT = 24.0;
const float SIZE = 1.8;
const float VARIANCE = 3.0;
const float VARIANCE_SIZE = 0.24;

float hash(float value)
{
	return fract(sin(value) * 23638.4851);
}

float cellHash(float value, float cellSize)
{
	return hash(floor(value / cellSize));
}

float gradientHash(float value, float cellSize)
{
	float cellValue = value / cellSize;
	float cellFloor = floor(cellValue);
	float cellFract = cellValue - cellFloor;

	float sample1 = 0.5 * (hash(cellFloor) + 1.0);
	float sample2 = 0.5 * (hash(cellFloor + 1.0) + 1.0);
	return mix(sample1, sample2, cellFract);
}

vec2 spiral(vec2 uv)
{
	float angle = atan(uv.y, uv.x);
	float correctedAngle = angle > 0.0 ? angle : (2.0 * PI - (-1.0 * angle));
	correctedAngle += ANGLE_SPEED * u_time;
	float radius = length(uv) * SPIRAL_REPEAT;
	float radiusAngle = mod(radius + gradientHash(radius + u_time, VARIANCE_SIZE) * VARIANCE, 2.0 * PI);
	float diff = abs(mod(radiusAngle - correctedAngle + PI, 2.0 * PI) - PI);
	return vec2(max(SIZE - diff, 0.0) / SIZE, abs(angle) / PI);
}

void main() {
	vec2 uv = v_uv * 2.0 - 1.0;
	vec2 spiralValues = spiral(uv);
	gl_FragColor = clamp(vec4(spiralValues.x, spiralValues.x * (1.0 - spiralValues.y - 0.3), spiralValues.x * (spiralValues.y - 0.3), 1.0), 0.0, 1.0);
}