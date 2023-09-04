# Multisample Anti Aliasing

## Table Of Contents

* [What is MSAA?](What%20is%20MSAA?)


## What is MSAA?

MSAA stands for Multi-Sampled Anti Aliasing. It is a way of reducing aliasing (jaggedy edges). This article won't focus too much on anti-aliasing in general, and will focus on MSAA.
However, understanding SSAA is somewhat useful in understanding MSAA. SSA is Super-Sampled Anti Aliasing. It is pretty simple, and just means you render at a higher resolution than your target
(e.g rendering at 4k for a 1080p monitor) and then downsampling. This means you get 2/4/8/however many pixels in the render ending up as 1 pixel in the final output. If you blend these pixels
to get the final result - this leads to smoother gradients between pixels along edges, and has a natural anti-aliasing effect. However, this is very *very* expensive, as it means 4x the pixel
shader invocations and 4x the memory bandwith, etc.

MSAA works