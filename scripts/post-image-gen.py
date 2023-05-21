#! /usr/bin/env python

import os
import getopt
import time
import numpy as np

from PIL import Image

import OpenGL
OpenGL.ERROR_ON_COPY = True
from OpenGL.GL import *
from OpenGL.GLU import *
from OpenGL.GLUT import *
from OpenGL.GL.shaders import *

vertex = """
#version 330
out vec2 v_uv;

void main() {
  v_uv = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(v_uv * vec2(2.0, -2.0) + vec2(-1.0, 1.0), 0.0, 1.0);
}
"""

fragment = """
#version 330
in vec2 v_uv;

layout(location = 0) out vec4 color;

uniform sampler2D texSampler;
uniform float u_time;

#define GLITCH_SIZE 1.0
#define GLITCH_SLIDE 0.01
#define GLITCH_SEPARATOR 0.01
#define TILE_SIZE 0.025
#define TILE_CUTOFF 0.93
#define TILE_SLIDE 0.25
#define LINE_SIZE 0.1
#define LINE_SLIDE 0.05
#define CHROMA_SLIDE 0.05

float hash(float value)
{
  return fract(sin(value) * 63758.2344);
}

float hash2D(vec2 value)
{
	return fract(sin(dot(value.xy, vec2(12.5235, 65.2345))) * 63758.5453);
}

void main(void)
{
  vec2 uv = v_uv * 2.0 - 1.0;
  float glitchValue = uv.x - uv.y;
  if (glitchValue > 2.0 - GLITCH_SIZE)
  {
    vec2 glitchUv = v_uv + (hash(u_time) * 2.0 - 1.0) * GLITCH_SLIDE;
    vec2 tile_id = floor(glitchUv / TILE_SIZE) + u_time;
    if (hash2D(tile_id) > TILE_CUTOFF)
    {
      vec2 tile_offset = (fract(glitchUv / TILE_SIZE) + u_time) * TILE_SIZE;
      vec2 tile_uv = (glitchUv + (vec2(hash(tile_id.x * 52.35), hash(tile_id.y * 23.12)) * 2.0 - 1.0) * TILE_SLIDE) + tile_offset;
      color = texture2D(texSampler, tile_uv);
    }
    else
    {
      float lineId = floor(glitchValue / LINE_SIZE);
      vec2 slideUV = vec2(hash(lineId + u_time) * 2.0 - 1.0) * LINE_SLIDE;
      color.r = texture2D(texSampler, glitchUv + slideUV).r;
      color.g = texture2D(texSampler, glitchUv).g;
      color.b = texture2D(texSampler, glitchUv - slideUV).b;
    }
  }
  else if (glitchValue > 2.0 - GLITCH_SIZE - GLITCH_SEPARATOR)
  {
    color = vec4(0.125, 0.125, 0.137, 1.0);
  }
  else
  {
	  color = texture2D(texSampler, v_uv);
  }
}
"""

startTime = time.time()
force = False

opts, args = getopt.getopt(sys.argv[1:], "hf", ["force"])

for opt, arg in opts:
  if opt == '-h':
    print('post-image-gen.py -f')
    print('-f --force => Forces script to regenerate all images inside the folder. Use with caution!')
    sys.exit()
  elif opt in ("-f", "--force"):
    force = True

imagesToProcess = []
processedImages = []

for root, dirs, files in os.walk("assets/images/raw_post_images"):
  for filename in files:
    imagesToProcess.append((os.path.join(root, filename), os.path.splitext(filename)[0]))

if not force:
  for root, dirs, files in os.walk("assets/images/post_images"):
    for filename in files:
      processedImages.append(os.path.splitext(filename)[0])

  imagesToProcess = [(path, filename) for path, filename in imagesToProcess if filename not in processedImages]

if len(imagesToProcess) > 0:
  print("======================")
  print("Generating post images")
  print("======================")

  glutInit()
  glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB)
  glutInitWindowPosition(0, 0)
  glutInitWindowSize(512, 512)
  glutCreateWindow("Post Image Generator")

  program = compileProgram(compileShader(vertex, GL_VERTEX_SHADER), compileShader(fragment, GL_FRAGMENT_SHADER))
  glUseProgram(program)

  texId = glGenTextures(1)
  glBindTexture(GL_TEXTURE_2D, texId)
  glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT)
  glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT)
  glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR)
  glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR)
  glBindTexture(GL_TEXTURE_2D, 0)

  for imagePath, filename in imagesToProcess:
    print("Loading image: " + imagePath)
    postImage = Image.open(imagePath)
    postImage = postImage.convert("RGBA")
    postImageData = np.array(postImage)

    glClearColor(0.0, 0.0, 0.0, 0.0)
    glClear(GL_COLOR_BUFFER_BIT)

    glEnable(GL_TEXTURE_2D)
    glActiveTexture(GL_TEXTURE0)

    glBindTexture(GL_TEXTURE_2D, texId)
    glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, postImage.width, postImage.height, 0, GL_RGBA, GL_UNSIGNED_BYTE, postImageData)

    glUniform1i(glGetUniformLocation(program, "texSampler"), 0)
    print(time.time() - startTime)
    glUniform1f(glGetUniformLocation(program, "u_time"), time.time() - startTime)

    glBegin(GL_POLYGON)
    glVertex3f(0.0, 0.0, 0.0)
    glVertex3f(0.0, 0.0, 0.0)
    glVertex3f(0.0, 0.0, 0.0)
    glEnd()
    glBindTexture(GL_TEXTURE_2D, 0)
    glDisable(GL_TEXTURE_2D)

    glFlush()

    pixels = glReadPixels(0, 0, 512, 512, GL_RGB, GL_UNSIGNED_BYTE)
    pixels = np.frombuffer(pixels, dtype=np.uint8).reshape((512, 512, 3))
    pixels = np.flipud(pixels)
    outputImage = Image.fromarray(pixels)
    outputPath = "assets/images/post_images/" + filename + ".jpg"
    outputImage.save(outputPath)

    print("Saved image to: " + outputPath)

print("Script took: ", round(time.time() - startTime, 4), "seconds.")
print("=========================")