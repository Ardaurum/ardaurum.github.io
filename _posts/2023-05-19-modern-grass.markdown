---
layout:     post
title:      "Modern Grass Rendering"
date:       2023-05-19 15:23:00 +0100
image:      assets/images/post_images/grass.jpg
categories: [Talk, Rendering, Unreal]
---

Have you ever wondered how games like _"Ghost of Tsushima"_ renders grass? Here's a talk I gave during Game Industry Conference in Poznań that talks precisely about this topic.

<!-- meat -->

<div class="center-iframe-wrapper"><iframe width="960" height="540" class="center-iframe" src="https://www.youtube-nocookie.com/embed/LCqeVnmcz3E" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>

During Game Industry Conference in Poznań I gave a talk about modern grass rendering solution used in games like _"Ghost of Tsushima"_, _"Genshin Impact"_ and _"Zelda: BoTW"_. In the talk I present a solution I call __"Single-Mesh-Per-Blade"__ technique which I implemented in Unreal Engine using Niagara. There are some tips and tricks of how to easily add player interaction and wind interaction to the grass.

The implementation I did is not production ready, however it presents the technique well enough and gives the idea of how to expand it further.

You can download the slides for the talk from my [GitHub Repo](https://github.com/Ardaurum/Grass_2022).