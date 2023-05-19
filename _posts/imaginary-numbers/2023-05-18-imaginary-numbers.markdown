---
layout:     post
title:      "Complex Numbers: a way to quaternions"
date:       2023-05-18 21:23:00 +0100
categories: [Math]
---
Complex numbers sound like a crazy idea. We have an imaginary part that has a rather curious property. It contains an __imaginary unit__ which we mark as $$ i $$ and it satisfies an equation $$ i^2 = -1 $$. Sounds like some crazy idea which someone just created as a brain challenge. And as a matter of fact it was at the start. This tool was created to solve cubic equations which contained root of negative numbers. In geometric sense it doesn't make sense, because how a figure with a negative size can exist. However it was used as an intermediate step to calculate a proper solution. And for another couple hundred of years it was just that until Euler and later Schrödinger. Schrödinger's most famous equation which is widely used in quantum-machnics contains an imaginary number.

$$ \class{palette-2}{i} \hbar \frac{\partial}{\partial t} \psi = H\psi $$

Why something that was deemed as *imaginary* and *useless* could be a part of something so fundamental in physics? And how this knowledge is useful for game programmers? To get to that answer we need to go through quite a bit of theory about complex numbers and it's different forms.

Let's start by taking a look at the complex plane.

{% include_relative complexAddGraph.html %}

If we look at complex number in form $$ \class{palette-3}{x} + \class{palette-2}{iy} $$ we could say that they are almost like __vectors__. And when we add complex numbers they behave just like vectors.

#### Polar Form
---

However, the magic is hidden in the multiplication of complex numbers. If you take one complex number and multiply it by another one then we are adding the angles that the complex vectors represent (as well as scale the complex vector). It might be a little bit hard to wrap a head around that, but here's another interactive graph to show that. The graph shows complex numbers in both complex and polar form.

{% include_relative complexMultiplyGraph.html %}

Now we can see it geometrically, but to understand it mathematically we need to look at the polar form of complex number. Polar form of a number is written using the radius $$ r $$ and angle $$ \theta $$. To convert a polar to complex form we use two formulas:

$$ 
\begin{align}
\begin{split}
\class{palette-3}{Re(z)} &= \class{palette-0}{r} \cos(\class{palette-1}{\theta}) \\ 
\class{palette-2}{Im(z)} &= i \class{palette-0}{r} \sin(\class{palette-1}{\theta}) 
\end{split}
\end{align} 
$$

where $$ \class{palette-3}{Re(z)} $$ is the real part of the complex number, i.e. $$ \class{palette-3}{x} $$ and the $$ \class{palette-2}{Im(z)} $$ is the imaginary part, i.e. $$ \class{palette-2}{iy} $$

And now we can add two complex numbers using $$ \class{palette-0}{r_1} $$ and $$ \class{palette-0}{r_2} $$ as radii and also $$ \class{palette-1}{\alpha} $$ and $$ \class{palette-1}{\beta} $$ for angles:

$$
\begin{align*}
& (\class{palette-0}{r_1} \cos(\class{palette-1}{\alpha}) + i \class{palette-0}{r_1} \sin(\class{palette-1}{\alpha})) \cdot (\class{palette-0}{r_2} \cos(\class{palette-1}{\beta}) + i \class{palette-0}{r_2} \sin(\class{palette-1}{\beta})) \\
\\
=&\: \class{palette-0}{r_1} \cos(\class{palette-1}{\alpha}) \cdot \class{palette-0}{r_2} \cos(\class{palette-1}{\beta}) - \class{palette-0}{r_1} \sin(\class{palette-1}{\alpha}) \cdot \class{palette-0}{r_2} \sin(\class{palette-1}{\beta}) \\
&+ i (\class{palette-0}{r_1} \cos(\class{palette-1}{\alpha}) \cdot \class{palette-0}{r_2} \sin(\class{palette-1}{\beta}) + \class{palette-0}{r_1} \sin(\class{palette-1}{\alpha}) \cdot \class{palette-0}{r_2} \cos(\class{palette-1}{\beta})) \\
\\
=&\: \class{palette-0}{r_1} \cdot \class{palette-0}{r_2} \cdot ((\cos(\class{palette-1}{\alpha}) \cos(\class{palette-1}{\beta}) - \sin(\class{palette-1}{\alpha}) \sin(\class{palette-1}{\beta})) \\
&+ i (\cos(\class{palette-1}{\alpha}) \sin(\class{palette-1}{\beta}) + \sin(\class{palette-1}{\alpha}) \cos(\class{palette-1}{\beta}))) \\
\end{align*} 
$$

For the last transformation of the equation we can use the angle sum identities which are:

$$
\begin{align*}
\cos(\class{palette-1}{\alpha + \beta}) &= \cos(\class{palette-1}{\alpha}) \cos(\class{palette-1}{\beta}) - \sin(\class{palette-1}{\alpha}) \sin(\class{palette-1}{\beta}) \\
\sin(\class{palette-1}{\alpha + \beta}) &= \sin(\class{palette-1}{\alpha}) \cos(\class{palette-1}{\beta}) + \cos(\class{palette-1}{\alpha}) \sin(\class{palette-1}{\beta})
\end{align*} 
$$

After the transformation it becomes this:

$$ 
\begin{align*}
& \class{palette-0}{r_1 r_2} (\cos(\class{palette-1}{\alpha + \beta}) + i \sin(\class{palette-1}{\alpha + \beta})) \\
=&\: \class{palette-0}{r_1 r_2} \cos(\class{palette-1}{\alpha + \beta}) + i \class{palette-0}{r_1 r_2} \sin(\class{palette-1}{\alpha + \beta})
\end{align*} 
$$

In the last equation you can really see that multiplying complex numbers is multiplication of radii and addition of angles.

#### Matrix Form
---

We can describe the complex number in yet another form which is the matrix form. To do that we need to find a matrix that behaves the same as the complex number, i.e. 

$$ 
\class{palette-3}{1}x + \class{palette-2}{i}y \quad\text{behaves like}\quad \class{palette-3}{I}x + \class{palette-2}{J}y
$$

from that we can see that the $$ \class{palette-3}{I} $$ matrix should be an identity matrix:

$$
\class{palette-3}{I} =
\left[\begin{array}{cc} 1&0 \\ 0&1 \end{array}\right]
$$

the more tricky one is the $$ \class{palette-2}{J} $$ matrix. To derive that one we need to ensure that the property of $$ \class{palette-2}{i} $$ which is $$ \class{palette-2}{i}^2 = -1 $$ is fulfilled, i.e. $$ \class{palette-2}{J}^2 = -I $$. So let's get to it:

$$
\class{palette-2}{J}^2 =
\left[\begin{array}{cc} -1&0 \\ 0&-1 \end{array}\right] = 
\left[\begin{array}{cc} 0&-1 \\ 1&0 \end{array}\right]^2
$$

As we can see the $$ \class{palette-2}{J} $$ can be described with a matrix $$ \left[\begin{array}{cc} 0&-1 \\ 1&0 \end{array}\right] $$. You could also use the other form of the matrix $$ \left[\begin{array}{cc} 0&1 \\ -1&0 \end{array}\right] $$. Getting this all together we can write a complex number as follows:

$$
\class{palette-3}{\left[\begin{array}{cc} 1&0 \\ 0&1 \end{array}\right]} x + \class{palette-2}{\left[\begin{array}{cc}0&-1\\1&0\end{array}\right]} y 
= \left[\begin{array}{cc} x&-y \\ y&x \end{array}\right]
$$

Now we are getting to an interesting part. If we assume that the complex number is always normalized, i.e. is a unit complex number where $$ \class{palette-0}{r} = 1 $$ then the equation $$ (1) $$ becomes this:

$$ 
\begin{align}
\begin{split}
\class{palette-3}{Re(z)} &= \cos(\class{palette-1}{\theta}) \\ 
\class{palette-2}{Im(z)} &= i \sin(\class{palette-1}{\theta}) 
\end{split}
\end{align}
$$

Thus we can now write our array in the form

$$
\left[
\begin{array}{cc}
  \cos(\class{palette-1}{\theta}) & -\sin(\class{palette-1}{\theta}) \\
  \sin(\class{palette-1}{\theta}) & \cos(\class{palette-1}{\theta})
\end{array}
\right]
$$

This might look very familiar if you ever had to write matrix rotation math. After all of this theory it's clear that we can use complex numbers as rotations and if we would like to we could even scale our vectors at the same time. To do that we just need to transform our vector $$ (x, y) $$ to a complex number $$ x + iy $$ and then multiply it by a unit complex number $$ a + ib $$ like so:

$$
(x + iy) * (a + ib) = ax - by + i(ay + bx)
$$

Doing so we get a rotated vector in a form $$ (ax - by, ay + bx) $$. Here's an example of how it looks like. 

We have a vector $$ (0.5, 0.7) $$ and we want to rotate it by 30 degrees which written as a complex number is around $$ (0.87, 0.5) $$. That gives us 

$$ (0.87 * 0.5 - 0.5 * 0.7, 0.87 * 0.7 + 0.5 * 0.5) = (0.085, 0.859) $$

We can confirm it using the standard rotation 

$$ 
\left[
\begin{array}{cc}
  \cos(30) & -\sin(30) \\
  \sin(30) & \cos(30)
\end{array}
\right] * \left[\begin{array}{c} 0.5 \\ 0.7 \end{array}\right]
= \left[\begin{array}{c} cos(30) * 0.5 - sin(30) * 0.7 \\ sin(30) * 0.5 + cos(30) * 0.7 \end{array}\right] $$

If we look at the tables for sin and cos we will see that $$ sin(30) = 0.5 $$ and $$ cos(30) \approx 0.87 $$ thus it's the same as previous calculations.

#### Game Programming - a way to quaternions
---

After all of that reading you might be wondering why we did all of that. Writing angles as a complex number is not convenient and if we need to transform from angles to complex numbers it won't be faster either. That's why in 2d math we still use a simple rotation matrix. However, a deep understanding of complex numbers is required to understand *QUATERNIONS*{:.palette-3} which are often presented as this magical beasts that nobody trully understands. This is because a lot of people skip learning complex numbers as they are not practical in game development. Those *QUATERNIONS*{:.palette-3} are really a generalization of complex numbers in higher dimensions. To show that I would require another post which I might write in the future :)

#### Bonus: Euler's Form
---

While researching complex numbers I also found out about Euler's form of complex numbers. It's just another form which might be more convenient to do specific operations. The Euler's form is written like this:

$$
\begin{align}
e^{i\theta} = \cos(\theta) + i \sin(\theta)
\end{align}
$$

We know from equation $$ (2) $$ that we can write this as:

$$
e^{i\theta} = x + iy
$$

where $$ x + iy $$ is a unit complex number that describes the rotation by $$ \theta $$. But where do we get the equation $$ (3) $$? We can do it using the **Taylor Series**. This is worth another post so for now you have to believe me when I write the Taylor series of euler's form of the complex number which is:

$$
\begin{align*}
e^{i\theta} &= 1 + ix - \frac{x^2}{2!} - \frac{ix^3}{3!} + \frac{x^4}{4!} + \frac{ix^5}{5!} - \cdots \\
&= (1 - \frac{x^2}{2!} + \frac{x^4}{4!} - \cdots) + i(x - \frac{x^3}{3!} + \frac{x^5}{5!} - \cdots)
\end{align*}
$$

If we compare that to the **Taylor Series** for *cos* and *sin* which are:

$$
\begin{align*}
\cos{x} = 1 - \frac{x^2}{2!} + \frac{x^4}{4!} - \cdots \\
\sin{x} = x - \frac{x^3}{3!} + \frac{x^5}{5!} - \cdots
\end{align*}
$$

it's visible that the euler's form can be written in the form as stated in the equation $$ (3) $$.

#### Bonus 2: Complex refractive index
---
If you read arcticles or books about refraction and absorption of light, you might've seen this formula:

$$
n = n_o + i\kappa
$$

This is formula for the refractive index $$ n $$. What it is and what it does is out of the scope of this post. However, you can see that complex numbers are present in many different areas of graphic programming. Because of that, I think it's a good idea to have an understanding of complex numbers.

#### Shader of the post
---

{% include_relative complexShader.html %}