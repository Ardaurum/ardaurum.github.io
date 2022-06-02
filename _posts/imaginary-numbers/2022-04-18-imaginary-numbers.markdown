---
layout:     post
title:      "Complex Numbers!"
date:       2022-04-18 21:23:00 +0100
categories: [Math]
---
Complex numbers sound like a crazy idea. You have an imaginary part that has a rather curious property. It contains an __imaginary unit__ which we mark as $$ i $$ and it satisfies an equation $$ i^2 = -1 $$. Sounds like some crazy idea which someone just created as a brain challenge. And as a matter of fact it was at the start. This tool was created to solve cubic equations which contained root of negative numbers. In geometric sense it doesn't make sense, because how a figure with a negative size can exist. However it was used as an intermediate step to calculate a proper solution. And for another couple hundred of years it was just that until Euler and later Schrödinger. Schrödinger's most famous equation which is widely used in quantum-machnics contains an imaginary number.

$$ i \hbar \frac{\partial}{\partial t} \psi = H\psi $$

Why something that was deemed as *imaginary* and *useless* could be a part of something so fundamental in physics? The answer lies in the geometric form of the complex numbers. Let's look at the cartesian complex plane.

{% include_relative complexAddGraph.html %}

If you look at complex number in form $$ x + yi $$ you could say that they are almost like __vectors__. And when you add complex numbers they behave just like vectors. However the magic is hidden in the multiplication of complex numbers. If you take one complex number and multiply it by another one then the real part scales the complex vector and the imaginary part rotates it. That fact makes it possible to describe scaling and rotation as a complex number.

{% include_relative complexMultiplyGraph.html %}