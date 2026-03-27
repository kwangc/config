# ML Fundamentals (Neural Network & Transformer)

---

## Key concepts

- **Neural Networks (NNs)** are function approximators learned from data (via weights + training objectives).
- **Training** is a loop: forward pass → loss → backprop → optimizer update.
- **Transformers** are attention-based sequence models; they scale well and power modern LLM/VLM/VLA stacks.

---

## Neural Networks: from layers to predictions

- **Layers** map inputs to representations; **weights** on connections determine the mapping.
- **Activation functions** add non-linearity, so the network can represent complex functions.
- **Loss (objective)** measures prediction error vs. ground truth; minimizing it improves accuracy.

### Diagram: forward pass (weights + activations)

<svg width="100%" viewBox="0 0 680 420" xmlns="http://www.w3.org/2000/svg">
<defs>
<marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
<path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</marker>
<mask id="imagine-text-gaps-gy3rh8" maskUnits="userSpaceOnUse"><rect x="0" y="0" width="680" height="420" fill="white"/><rect x="100.43132781982422" y="15.722145080566406" width="39.13734817504883" height="19.1112060546875" fill="black" rx="2"/><rect x="280.43133544921875" y="15.722145080566406" width="39.13734817504883" height="19.1112060546875" fill="black" rx="2"/><rect x="460.43133544921875" y="15.722145080566406" width="39.13734817504883" height="19.1112060546875" fill="black" rx="2"/><rect x="590.4313354492188" y="15.722145080566406" width="39.13734817504883" height="19.1112060546875" fill="black" rx="2"/><rect x="100.43132781982422" y="89.7221450805664" width="39.13734817504883" height="19.1112060546875" fill="black" rx="2"/><rect x="105.6184310913086" y="159.72215270996094" width="28.763151168823242" height="19.1112060546875" fill="black" rx="2"/><rect x="110.80552673339844" y="229.72215270996094" width="18.388954162597656" height="19.1112060546875" fill="black" rx="2"/><rect x="580.4313354492188" y="151.72215270996094" width="39.13734817504883" height="19.1112060546875" fill="black" rx="2"/><rect x="583.0507202148438" y="165.72213745117188" width="33.89859962463379" height="19.1112060546875" fill="black" rx="2"/><rect x="188.2772216796875" y="121.72215270996094" width="47.445560455322266" height="19.1112060546875" fill="black" rx="2"/><rect x="227.97744750976562" y="355.72216796875" width="144.0451202392578" height="19.23450756072998" fill="black" rx="2"/><rect x="207.98904418945312" y="375.72216796875" width="184.02194213867188" height="19.1112060546875" fill="black" rx="2"/><rect x="48" y="147.72215270996094" width="28.763151168823242" height="19.1112060546875" fill="black" rx="2"/><rect x="634.0000610351562" y="147.72215270996094" width="28.763151168823242" height="19.1112060546875" fill="black" rx="2"/></mask></defs>
<!-- Layer labels -->
<text x="120" y="30" text-anchor="middle" style="fill:var(--color-text-secondary);fill:rgb(194, 192, 182);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:12px;font-weight:400;text-anchor:middle;dominant-baseline:auto">Input layer</text>
<text x="300" y="30" text-anchor="middle" style="fill:var(--color-text-secondary);fill:rgb(194, 192, 182);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:12px;font-weight:400;text-anchor:middle;dominant-baseline:auto">Hidden layer</text>
<text x="480" y="30" text-anchor="middle" style="fill:var(--color-text-secondary);fill:rgb(194, 192, 182);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:12px;font-weight:400;text-anchor:middle;dominant-baseline:auto">Hidden layer</text>
<text x="610" y="30" text-anchor="middle" style="fill:var(--color-text-secondary);fill:rgb(194, 192, 182);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:12px;font-weight:400;text-anchor:middle;dominant-baseline:auto">Output layer</text>
<!-- Input → Hidden 1 connections (faint lines) -->
<g stroke="#7F77DD" stroke-width="0.8" opacity="0.25" fill="none" style="fill:none;stroke:rgb(127, 119, 221);color:rgb(255, 255, 255);stroke-width:0.8px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.25;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto">
  <line x1="140" y1="100" x2="278" y2="90" style="fill:none;stroke:rgb(127, 119, 221);color:rgb(255, 255, 255);stroke-width:0.8px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
  <line x1="140" y1="100" x2="278" y2="160" mask="url(#imagine-text-gaps-gy3rh8)" style="fill:none;stroke:rgb(127, 119, 221);color:rgb(255, 255, 255);stroke-width:0.8px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
  <line x1="140" y1="100" x2="278" y2="230" style="fill:none;stroke:rgb(127, 119, 221);color:rgb(255, 255, 255);stroke-width:0.8px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
  <line x1="140" y1="100" x2="278" y2="300" style="fill:none;stroke:rgb(127, 119, 221);color:rgb(255, 255, 255);stroke-width:0.8px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
  <line x1="140" y1="170" x2="278" y2="90" mask="url(#imagine-text-gaps-gy3rh8)" style="fill:none;stroke:rgb(127, 119, 221);color:rgb(255, 255, 255);stroke-width:0.8px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
  <line x1="140" y1="170" x2="278" y2="160" style="fill:none;stroke:rgb(127, 119, 221);color:rgb(255, 255, 255);stroke-width:0.8px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
  <line x1="140" y1="170" x2="278" y2="230" style="fill:none;stroke:rgb(127, 119, 221);color:rgb(255, 255, 255);stroke-width:0.8px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
  <line x1="140" y1="170" x2="278" y2="300" style="fill:none;stroke:rgb(127, 119, 221);color:rgb(255, 255, 255);stroke-width:0.8px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
  <line x1="140" y1="240" x2="278" y2="90" mask="url(#imagine-text-gaps-gy3rh8)" style="fill:none;stroke:rgb(127, 119, 221);color:rgb(255, 255, 255);stroke-width:0.8px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
  <line x1="140" y1="240" x2="278" y2="160" style="fill:none;stroke:rgb(127, 119, 221);color:rgb(255, 255, 255);stroke-width:0.8px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
  <line x1="140" y1="240" x2="278" y2="230" style="fill:none;stroke:rgb(127, 119, 221);color:rgb(255, 255, 255);stroke-width:0.8px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
  <line x1="140" y1="240" x2="278" y2="300" style="fill:none;stroke:rgb(127, 119, 221);color:rgb(255, 255, 255);stroke-width:0.8px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
</g>
<!-- Hidden 1 → Hidden 2 connections -->
<g stroke="#1D9E75" stroke-width="0.8" opacity="0.25" fill="none" style="fill:none;stroke:rgb(29, 158, 117);color:rgb(255, 255, 255);stroke-width:0.8px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.25;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto">
  <line x1="322" y1="90" x2="458" y2="120" style="fill:none;stroke:rgb(29, 158, 117);color:rgb(255, 255, 255);stroke-width:0.8px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
  <line x1="322" y1="90" x2="458" y2="210" style="fill:none;stroke:rgb(29, 158, 117);color:rgb(255, 255, 255);stroke-width:0.8px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
  <line x1="322" y1="90" x2="458" y2="300" style="fill:none;stroke:rgb(29, 158, 117);color:rgb(255, 255, 255);stroke-width:0.8px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
  <line x1="322" y1="160" x2="458" y2="120" style="fill:none;stroke:rgb(29, 158, 117);color:rgb(255, 255, 255);stroke-width:0.8px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
  <line x1="322" y1="160" x2="458" y2="210" style="fill:none;stroke:rgb(29, 158, 117);color:rgb(255, 255, 255);stroke-width:0.8px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
  <line x1="322" y1="160" x2="458" y2="300" style="fill:none;stroke:rgb(29, 158, 117);color:rgb(255, 255, 255);stroke-width:0.8px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
  <line x1="322" y1="230" x2="458" y2="120" style="fill:none;stroke:rgb(29, 158, 117);color:rgb(255, 255, 255);stroke-width:0.8px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
  <line x1="322" y1="230" x2="458" y2="210" style="fill:none;stroke:rgb(29, 158, 117);color:rgb(255, 255, 255);stroke-width:0.8px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
  <line x1="322" y1="230" x2="458" y2="300" style="fill:none;stroke:rgb(29, 158, 117);color:rgb(255, 255, 255);stroke-width:0.8px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
  <line x1="322" y1="300" x2="458" y2="120" style="fill:none;stroke:rgb(29, 158, 117);color:rgb(255, 255, 255);stroke-width:0.8px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
  <line x1="322" y1="300" x2="458" y2="210" style="fill:none;stroke:rgb(29, 158, 117);color:rgb(255, 255, 255);stroke-width:0.8px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
  <line x1="322" y1="300" x2="458" y2="300" style="fill:none;stroke:rgb(29, 158, 117);color:rgb(255, 255, 255);stroke-width:0.8px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
</g>
<!-- Hidden 2 → Output connections -->
<g stroke="#EF9F27" stroke-width="1.2" opacity="0.4" fill="none" style="fill:none;stroke:rgb(239, 159, 39);color:rgb(255, 255, 255);stroke-width:1.2px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.4;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto">
  <line x1="482" y1="120" x2="588" y2="170" mask="url(#imagine-text-gaps-gy3rh8)" style="fill:none;stroke:rgb(239, 159, 39);color:rgb(255, 255, 255);stroke-width:1.2px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
  <line x1="482" y1="210" x2="588" y2="170" mask="url(#imagine-text-gaps-gy3rh8)" style="fill:none;stroke:rgb(239, 159, 39);color:rgb(255, 255, 255);stroke-width:1.2px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
  <line x1="482" y1="300" x2="588" y2="170" mask="url(#imagine-text-gaps-gy3rh8)" style="fill:none;stroke:rgb(239, 159, 39);color:rgb(255, 255, 255);stroke-width:1.2px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
</g>
<!-- Input nodes -->
<g style="fill:rgb(0, 0, 0);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto">
  <circle cx="120" cy="100" r="20" stroke-width="0.5" style="fill:rgb(60, 52, 137);stroke:rgb(175, 169, 236);color:rgb(255, 255, 255);stroke-width:0.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
  <text x="120" y="104" text-anchor="middle" style="fill:rgb(175, 169, 236);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:12px;font-weight:400;text-anchor:middle;dominant-baseline:auto">Image</text>
</g>
<g style="fill:rgb(0, 0, 0);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto">
  <circle cx="120" cy="170" r="20" stroke-width="0.5" style="fill:rgb(60, 52, 137);stroke:rgb(175, 169, 236);color:rgb(255, 255, 255);stroke-width:0.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
  <text x="120" y="174" text-anchor="middle" style="fill:rgb(175, 169, 236);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:12px;font-weight:400;text-anchor:middle;dominant-baseline:auto">Pixels</text>
</g>
<g style="fill:rgb(0, 0, 0);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto">
  <circle cx="120" cy="240" r="20" stroke-width="0.5" style="fill:rgb(60, 52, 137);stroke:rgb(175, 169, 236);color:rgb(255, 255, 255);stroke-width:0.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
  <text x="120" y="244" text-anchor="middle" style="fill:rgb(175, 169, 236);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:12px;font-weight:400;text-anchor:middle;dominant-baseline:auto">Values</text>
</g>
<!-- Hidden 1 nodes -->
<g style="fill:rgb(0, 0, 0);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto">
  <circle cx="300" cy="90" r="18" stroke-width="0.5" style="fill:rgb(8, 80, 65);stroke:rgb(93, 202, 165);color:rgb(255, 255, 255);stroke-width:0.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
</g>
<g style="fill:rgb(0, 0, 0);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto">
  <circle cx="300" cy="160" r="18" stroke-width="0.5" style="fill:rgb(8, 80, 65);stroke:rgb(93, 202, 165);color:rgb(255, 255, 255);stroke-width:0.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
</g>
<g style="fill:rgb(0, 0, 0);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto">
  <circle cx="300" cy="230" r="18" stroke-width="0.5" style="fill:rgb(8, 80, 65);stroke:rgb(93, 202, 165);color:rgb(255, 255, 255);stroke-width:0.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
</g>
<g style="fill:rgb(0, 0, 0);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto">
  <circle cx="300" cy="300" r="18" stroke-width="0.5" style="fill:rgb(8, 80, 65);stroke:rgb(93, 202, 165);color:rgb(255, 255, 255);stroke-width:0.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
</g>
<!-- Hidden 2 nodes -->
<g style="fill:rgb(0, 0, 0);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto">
  <circle cx="470" cy="120" r="18" stroke-width="0.5" style="fill:rgb(8, 80, 65);stroke:rgb(93, 202, 165);color:rgb(255, 255, 255);stroke-width:0.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
</g>
<g style="fill:rgb(0, 0, 0);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto">
  <circle cx="470" cy="210" r="18" stroke-width="0.5" style="fill:rgb(8, 80, 65);stroke:rgb(93, 202, 165);color:rgb(255, 255, 255);stroke-width:0.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
</g>
<g style="fill:rgb(0, 0, 0);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto">
  <circle cx="470" cy="300" r="18" stroke-width="0.5" style="fill:rgb(8, 80, 65);stroke:rgb(93, 202, 165);color:rgb(255, 255, 255);stroke-width:0.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
</g>
<!-- Output node -->
<g style="fill:rgb(0, 0, 0);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto">
  <circle cx="600" cy="170" r="24" stroke-width="0.5" style="fill:rgb(99, 56, 6);stroke:rgb(239, 159, 39);color:rgb(255, 255, 255);stroke-width:0.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
  <text x="600" y="166" text-anchor="middle" style="fill:rgb(239, 159, 39);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:12px;font-weight:400;text-anchor:middle;dominant-baseline:auto">Cat</text>
  <text x="600" y="180" text-anchor="middle" style="fill:rgb(239, 159, 39);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:12px;font-weight:400;text-anchor:middle;dominant-baseline:auto">94%</text>
</g>
<!-- Weight annotation on one connection -->
<path d="M140 170 Q210 130 278 160" stroke="#7F77DD" stroke-width="2.5" fill="none" opacity="0.9" style="fill:none;stroke:rgb(127, 119, 221);color:rgb(255, 255, 255);stroke-width:2.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:0.9;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<rect x="185" y="122" width="54" height="20" rx="4" fill="var(--color-background-secondary)" stroke="var(--color-border-tertiary)" stroke-width="0.5" style="fill:rgb(38, 38, 36);stroke:rgba(222, 220, 209, 0.15);color:rgb(255, 255, 255);stroke-width:0.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="212" y="136" text-anchor="middle" style="fill:var(--color-text-secondary);fill:rgb(194, 192, 182);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:12px;font-weight:400;text-anchor:middle;dominant-baseline:auto">w = 0.8</text>
<!-- Bottom labels -->
<text x="300" y="370" text-anchor="middle" style="fill:var(--color-text-tertiary);fill:rgb(156, 154, 146);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:12px;font-weight:400;text-anchor:middle;dominant-baseline:auto">Each connection = weight (learnable)</text>
<text x="300" y="390" text-anchor="middle" style="fill:var(--color-text-tertiary);fill:rgb(156, 154, 146);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:12px;font-weight:400;text-anchor:middle;dominant-baseline:auto">Learning = adjusting weights step by step</text>
<!-- Flow arrow -->
<line x1="50" y1="170" x2="85" y2="170" marker-end="url(#arrow)" stroke="var(--color-text-tertiary)" stroke-width="1" style="fill:none;stroke:rgb(156, 154, 146);color:rgb(255, 255, 255);stroke-width:1.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="52" y="162" style="fill:var(--color-text-tertiary);fill:rgb(156, 154, 146);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:12px;font-weight:400;text-anchor:start;dominant-baseline:auto">Input</text>
<line x1="632" y1="170" x2="650" y2="170" marker-end="url(#arrow)" stroke="var(--color-text-tertiary)" stroke-width="1" style="fill:none;stroke:rgb(156, 154, 146);color:rgb(255, 255, 255);stroke-width:1.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="638" y="162" style="fill:var(--color-text-tertiary);fill:rgb(156, 154, 146);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:12px;font-weight:400;text-anchor:start;dominant-baseline:auto">Output</text>
</svg>

### Diagram: backpropagation (loss → weight updates)

<svg width="100%" viewBox="0 0 680 340" xmlns="http://www.w3.org/2000/svg">
<defs>
<marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
<path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</marker>
<mask id="imagine-text-gaps-nvxg8v" maskUnits="userSpaceOnUse"><rect x="0" y="0" width="680" height="340" fill="white"/><rect x="232.8711395263672" y="13.722223281860352" width="214.2578125" height="19.156444549560547" fill="black" rx="2"/><rect x="73.89192962646484" y="61.972225189208984" width="32.21614456176758" height="20.05555534362793" fill="black" rx="2"/><rect x="53.60112380981445" y="71.72222900390625" width="72.79774475097656" height="19.11111068725586" fill="black" rx="2"/><rect x="227.83421325683594" y="61.972225189208984" width="44.33159637451172" height="20.05555534362793" fill="black" rx="2"/><rect x="223.9752655029297" y="71.72222900390625" width="52.049476623535156" height="19.11111068725586" fill="black" rx="2"/><rect x="387.834228515625" y="61.972225189208984" width="44.33159637451172" height="20.05555534362793" fill="black" rx="2"/><rect x="383.97528076171875" y="71.72222900390625" width="52.049476623535156" height="19.11111068725586" fill="black" rx="2"/><rect x="553.8919067382812" y="57.97222137451172" width="32.21614456176758" height="20.05555534362793" fill="black" rx="2"/><rect x="536.5377807617188" y="69.72222137451172" width="66.92447662353516" height="19.11111068725586" fill="black" rx="2"/><rect x="296.8255310058594" y="157.9722137451172" width="66.34895706176758" height="20.05555534362793" fill="black" rx="2"/><rect x="224.97398376464844" y="171.72222900390625" width="210.0520782470703" height="19.11111068725586" fill="black" rx="2"/><rect x="543.888916015625" y="155.9722137451172" width="72.22222137451172" height="20.05555534362793" fill="black" rx="2"/><rect x="543.7413330078125" y="167.72222900390625" width="72.5173568725586" height="19.11111068725586" fill="black" rx="2"/><rect x="181.7752227783203" y="217.7222137451172" width="316.44964599609375" height="19.156448364257812" fill="black" rx="2"/><rect x="476.5356140136719" y="261.97222900390625" width="46.92881774902344" height="20.05555534362793" fill="black" rx="2"/><rect x="316.5356140136719" y="261.97222900390625" width="46.92881774902344" height="20.05555534362793" fill="black" rx="2"/><rect x="116.53559875488281" y="261.97222900390625" width="46.92881774902344" height="20.05555534362793" fill="black" rx="2"/><rect x="208.13113403320312" y="303.72222900390625" width="263.7378387451172" height="19.11111068725586" fill="black" rx="2"/></mask></defs>
<!-- ── Forward pass (top flow) ── -->
<text x="340" y="28" text-anchor="middle" style="fill:var(--color-text-tertiary);fill:rgb(156, 154, 146);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:12px;font-weight:400;text-anchor:middle;dominant-baseline:auto">① Forward pass — Input → Prediction</text>
<!-- Nodes -->
<g style="fill:rgb(0, 0, 0);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto">
  <rect x="40" y="50" width="100" height="44" rx="8" stroke-width="0.5" style="fill:rgb(60, 52, 137);stroke:rgb(175, 169, 236);color:rgb(255, 255, 255);stroke-width:0.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
  <text x="90" y="72" text-anchor="middle" dominant-baseline="central" style="fill:rgb(206, 203, 246);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:14px;font-weight:500;text-anchor:middle;dominant-baseline:central">Input</text>
  <text x="90" y="86" text-anchor="middle" style="fill:rgb(175, 169, 236);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:12px;font-weight:400;text-anchor:middle;dominant-baseline:auto">Cat image</text>
</g>
<g style="fill:rgb(0, 0, 0);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto">
  <rect x="200" y="50" width="100" height="44" rx="8" stroke-width="0.5" style="fill:rgb(8, 80, 65);stroke:rgb(93, 202, 165);color:rgb(255, 255, 255);stroke-width:0.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
  <text x="250" y="72" text-anchor="middle" dominant-baseline="central" style="fill:rgb(159, 225, 203);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:14px;font-weight:500;text-anchor:middle;dominant-baseline:central">Hidden layer</text>
  <text x="250" y="86" text-anchor="middle" style="fill:rgb(93, 202, 165);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:12px;font-weight:400;text-anchor:middle;dominant-baseline:auto">Feature extraction</text>
</g>
<g style="fill:rgb(0, 0, 0);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto">
  <rect x="360" y="50" width="100" height="44" rx="8" stroke-width="0.5" style="fill:rgb(8, 80, 65);stroke:rgb(93, 202, 165);color:rgb(255, 255, 255);stroke-width:0.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
  <text x="410" y="72" text-anchor="middle" dominant-baseline="central" style="fill:rgb(159, 225, 203);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:14px;font-weight:500;text-anchor:middle;dominant-baseline:central">Hidden layer</text>
  <text x="410" y="86" text-anchor="middle" style="fill:rgb(93, 202, 165);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:12px;font-weight:400;text-anchor:middle;dominant-baseline:auto">Pattern recognition</text>
</g>
<g style="fill:rgb(0, 0, 0);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto">
  <rect x="520" y="50" width="100" height="44" rx="8" stroke-width="0.5" style="fill:rgb(113, 43, 19);stroke:rgb(240, 153, 123);color:rgb(255, 255, 255);stroke-width:0.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
  <text x="570" y="68" text-anchor="middle" dominant-baseline="central" style="fill:rgb(245, 196, 179);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:14px;font-weight:500;text-anchor:middle;dominant-baseline:central">Prediction</text>
  <text x="570" y="84" text-anchor="middle" style="fill:rgb(240, 153, 123);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:12px;font-weight:400;text-anchor:middle;dominant-baseline:auto">Dog 72%</text>
</g>
<!-- Forward arrows -->
<line x1="141" y1="72" x2="198" y2="72" marker-end="url(#arrow)" stroke="#7F77DD" stroke-width="1.5" style="fill:none;stroke:rgb(156, 154, 146);color:rgb(255, 255, 255);stroke-width:1.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<line x1="301" y1="72" x2="358" y2="72" marker-end="url(#arrow)" stroke="#1D9E75" stroke-width="1.5" style="fill:none;stroke:rgb(156, 154, 146);color:rgb(255, 255, 255);stroke-width:1.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<line x1="461" y1="72" x2="518" y2="72" marker-end="url(#arrow)" stroke="#1D9E75" stroke-width="1.5" style="fill:none;stroke:rgb(156, 154, 146);color:rgb(255, 255, 255);stroke-width:1.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<!-- ── Loss calculation ── -->
<rect x="200" y="148" width="260" height="52" rx="8" fill="var(--color-background-secondary)" stroke="var(--color-border-secondary)" stroke-width="0.5" style="fill:rgb(38, 38, 36);stroke:rgba(222, 220, 209, 0.3);color:rgb(255, 255, 255);stroke-width:0.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<text x="330" y="168" text-anchor="middle" dominant-baseline="central" style="fill:var(--color-text-primary);fill:rgb(250, 249, 245);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:14px;font-weight:500;text-anchor:middle;dominant-baseline:central">Loss calculation</text>
<text x="330" y="186" text-anchor="middle" style="fill:var(--color-text-secondary);fill:rgb(194, 192, 182);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:12px;font-weight:400;text-anchor:middle;dominant-baseline:auto">Predicted (Dog 72%) vs Ground truth (Cat 100%)</text>
<!-- Predicted → Loss -->
<line x1="570" y1="95" x2="460" y2="148" marker-end="url(#arrow)" stroke="var(--color-text-tertiary)" stroke-width="1" style="fill:none;stroke:rgb(156, 154, 146);color:rgb(255, 255, 255);stroke-width:1.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<!-- Ground truth label -->
<g style="fill:rgb(0, 0, 0);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto">
  <rect x="520" y="148" width="120" height="44" rx="8" stroke-width="0.5" style="fill:rgb(39, 80, 10);stroke:rgb(151, 196, 89);color:rgb(255, 255, 255);stroke-width:0.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
  <text x="580" y="166" text-anchor="middle" dominant-baseline="central" style="fill:rgb(192, 221, 151);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:14px;font-weight:500;text-anchor:middle;dominant-baseline:central">Ground truth label</text>
  <text x="580" y="182" text-anchor="middle" style="fill:rgb(151, 196, 89);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:12px;font-weight:400;text-anchor:middle;dominant-baseline:auto">Cat 100%</text>
</g>
<line x1="519" y1="172" x2="462" y2="172" marker-end="url(#arrow)" stroke="#3B6D11" stroke-width="1" style="fill:none;stroke:rgb(156, 154, 146);color:rgb(255, 255, 255);stroke-width:1.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<!-- ── Backward pass (bottom flow) ── -->
<text x="340" y="232" text-anchor="middle" style="fill:var(--color-text-tertiary);fill:rgb(156, 154, 146);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:12px;font-weight:400;text-anchor:middle;dominant-baseline:auto">② Backward pass — propagate loss backward, adjust weights</text>
<!-- Backward arrows -->
<line x1="199" y1="200" x2="152" y2="272" marker-end="url(#arrow)" stroke="#D85A30" stroke-width="1.5" mask="url(#imagine-text-gaps-nvxg8v)" style="fill:none;stroke:rgb(156, 154, 146);color:rgb(255, 255, 255);stroke-width:1.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<line x1="280" y1="272" x2="240" y2="272" marker-end="url(#arrow)" stroke="#D85A30" stroke-width="1.5" style="fill:none;stroke:rgb(156, 154, 146);color:rgb(255, 255, 255);stroke-width:1.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<line x1="440" y1="272" x2="400" y2="272" marker-end="url(#arrow)" stroke="#D85A30" stroke-width="1.5" style="fill:none;stroke:rgb(156, 154, 146);color:rgb(255, 255, 255);stroke-width:1.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<line x1="560" y1="272" x2="520" y2="272" marker-end="url(#arrow)" stroke="#D85A30" stroke-width="1.5" mask="url(#imagine-text-gaps-nvxg8v)" style="fill:none;stroke:rgb(156, 154, 146);color:rgb(255, 255, 255);stroke-width:1.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
<!-- weight update labels -->
<g style="fill:rgb(0, 0, 0);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto">
  <rect x="440" y="252" width="120" height="40" rx="8" stroke-width="0.5" style="fill:rgb(113, 43, 19);stroke:rgb(240, 153, 123);color:rgb(255, 255, 255);stroke-width:0.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
  <text x="500" y="272" text-anchor="middle" dominant-baseline="central" style="fill:rgb(245, 196, 179);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:14px;font-weight:500;text-anchor:middle;dominant-baseline:central">Adjust w</text>
</g>
<g style="fill:rgb(0, 0, 0);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto">
  <rect x="280" y="252" width="120" height="40" rx="8" stroke-width="0.5" style="fill:rgb(113, 43, 19);stroke:rgb(240, 153, 123);color:rgb(255, 255, 255);stroke-width:0.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
  <text x="340" y="272" text-anchor="middle" dominant-baseline="central" style="fill:rgb(245, 196, 179);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:14px;font-weight:500;text-anchor:middle;dominant-baseline:central">Adjust w</text>
</g>
<g style="fill:rgb(0, 0, 0);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto">
  <rect x="80" y="252" width="120" height="40" rx="8" stroke-width="0.5" style="fill:rgb(113, 43, 19);stroke:rgb(240, 153, 123);color:rgb(255, 255, 255);stroke-width:0.5px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:16px;font-weight:400;text-anchor:start;dominant-baseline:auto"/>
  <text x="140" y="272" text-anchor="middle" dominant-baseline="central" style="fill:rgb(245, 196, 179);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:14px;font-weight:500;text-anchor:middle;dominant-baseline:central">Adjust w</text>
</g>
<!-- Repeat label -->
<text x="340" y="318" text-anchor="middle" style="fill:var(--color-text-tertiary);fill:rgb(156, 154, 146);stroke:none;color:rgb(255, 255, 255);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;opacity:1;font-family:&quot;Anthropic Sans&quot;, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, sans-serif;font-size:12px;font-weight:400;text-anchor:middle;dominant-baseline:auto">Repeat this process many times → model improves</text>
</svg>

---

## Training loop: loss → gradients → updates

- **Dataset splits**: train for learning, validation for tuning, test for the final check.
- **Learning rate** controls how big each step is:
  - too large: overshoot / unstable learning
  - too small: slow learning
- **Generalization** depends on matching the objective to what you truly care about (especially for robotics tasks).

---

## Transformer & Attention: what attention does

Instead of processing tokens strictly one-by-one (like classic RNNs), Transformers let each token “look at” other tokens. This produces a content-aware mixture of information rather than a fixed sequential state.

### Diagram: attention mechanism

<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 680 420">
<defs>
<marker id="arrow-en-attn-mech" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
<path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</marker>
</defs>
<!-- Title -->
<text x="340" y="22" text-anchor="middle" font-size="12" fill="#6a6a64">Calculating which word "it" is related to</text>
<!-- Subtitle -->
<text x="340" y="54" text-anchor="middle" font-size="12" fill="#6a6a64">Each token simultaneously plays three roles</text>
<!-- Q -->
<rect x="100" y="66" width="150" height="52" rx="8" fill="#26215C" stroke="#7F77DD" stroke-width="1"/>
<text x="175" y="87" text-anchor="middle" font-size="14" font-weight="500" fill="#CECBF6">Query (Q)</text>
<text x="175" y="106" text-anchor="middle" font-size="11" fill="#AFA9EC">"What am I looking for?"</text>
<!-- K -->
<rect x="278" y="66" width="150" height="52" rx="8" fill="#04342C" stroke="#1D9E75" stroke-width="1"/>
<text x="353" y="87" text-anchor="middle" font-size="14" font-weight="500" fill="#9FE1CB">Key (K)</text>
<text x="353" y="106" text-anchor="middle" font-size="11" fill="#5DCAA5">"What do I have?"</text>
<!-- V -->
<rect x="456" y="66" width="150" height="52" rx="8" fill="#4A1B0C" stroke="#D85A30" stroke-width="1"/>
<text x="531" y="87" text-anchor="middle" font-size="14" font-weight="500" fill="#F5C4B3">Value (V)</text>
<text x="531" y="106" text-anchor="middle" font-size="11" fill="#F0997B">"Actual information"</text>
<!-- Q → K arrow with dot label -->
<line x1="251" y1="92" x2="276" y2="92" stroke="#6a6a64" stroke-width="1" marker-end="url(#arrow-en-attn-mech)"/>
<text x="263" y="86" text-anchor="middle" font-size="11" fill="#6a6a64">·</text>
<!-- K → V arrow with weight label -->
<line x1="429" y1="92" x2="454" y2="92" stroke="#6a6a64" stroke-width="1" marker-end="url(#arrow-en-attn-mech)"/>
<text x="441" y="84" text-anchor="middle" font-size="10" fill="#6a6a64">→ weight</text>
<!-- Attention weights callout box -->
<rect x="310" y="160" width="260" height="48" rx="8" fill="#272725" stroke="#BA7517" stroke-width="1"/>
<text x="440" y="179" text-anchor="middle" font-size="12" font-weight="500" fill="#FAC775">Attention weights</text>
<text x="440" y="197" text-anchor="middle" font-size="11" fill="#EF9F27">cup: 0.82 · robot: 0.09 · others: &lt;0.05</text>
<!-- Tokens row -->
<!-- The -->
<rect x="20" y="286" width="72" height="44" rx="8" fill="#2C2C2A" stroke="#5F5E5A" stroke-width="0.5"/>
<text x="56" y="312" text-anchor="middle" font-size="13" fill="#D3D1C7">The</text>
<!-- robot -->
<rect x="104" y="286" width="72" height="44" rx="8" fill="#2C2C2A" stroke="#5F5E5A" stroke-width="0.5"/>
<text x="140" y="312" text-anchor="middle" font-size="13" fill="#D3D1C7">robot</text>
<!-- picked -->
<rect x="188" y="286" width="72" height="44" rx="8" fill="#2C2C2A" stroke="#5F5E5A" stroke-width="0.5"/>
<text x="224" y="312" text-anchor="middle" font-size="13" fill="#D3D1C7">picked</text>
<!-- up -->
<rect x="272" y="286" width="72" height="44" rx="8" fill="#2C2C2A" stroke="#5F5E5A" stroke-width="0.5"/>
<text x="308" y="312" text-anchor="middle" font-size="13" fill="#D3D1C7">up</text>
<!-- "it" highlighted -->
<rect x="356" y="278" width="72" height="60" rx="8" fill="#412402" stroke="#BA7517" stroke-width="1.5"/>
<text x="392" y="302" text-anchor="middle" font-size="14" font-weight="600" fill="#FAC775">it</text>
<text x="392" y="322" text-anchor="middle" font-size="10" fill="#EF9F27">← current token</text>
<!-- the -->
<rect x="440" y="286" width="72" height="44" rx="8" fill="#2C2C2A" stroke="#5F5E5A" stroke-width="0.5"/>
<text x="476" y="312" text-anchor="middle" font-size="13" fill="#D3D1C7">the</text>
<!-- "cup" highlighted -->
<rect x="524" y="278" width="72" height="60" rx="8" fill="#04342C" stroke="#1D9E75" stroke-width="1.5"/>
<text x="560" y="302" text-anchor="middle" font-size="14" font-weight="600" fill="#9FE1CB">cup</text>
<text x="560" y="322" text-anchor="middle" font-size="10" fill="#5DCAA5">← most related</text>
<!-- Attention lines from "it" to all tokens -->
<line x1="392" y1="278" x2="56" y2="330" stroke="#EF9F27" stroke-width="0.7" opacity="0.2"/>
<line x1="392" y1="278" x2="140" y2="330" stroke="#EF9F27" stroke-width="1.2" opacity="0.35"/>
<line x1="392" y1="278" x2="224" y2="330" stroke="#EF9F27" stroke-width="1" opacity="0.28"/>
<line x1="392" y1="278" x2="308" y2="330" stroke="#EF9F27" stroke-width="0.7" opacity="0.18"/>
<line x1="392" y1="278" x2="476" y2="330" stroke="#EF9F27" stroke-width="1" opacity="0.25"/>
<!-- it → cup: strongest -->
<line x1="392" y1="278" x2="560" y2="278" stroke="#EF9F27" stroke-width="5" opacity="0.95"/>
<!-- callout → cup connector -->
<line x1="530" y1="208" x2="548" y2="278" stroke="#BA7517" stroke-width="0.5" stroke-dasharray="3 3"/>
<!-- Bottom label -->
<text x="340" y="396" text-anchor="middle" font-size="12" fill="#6a6a64">Line thickness = attention weight (thicker = more focused)</text>
</svg>

### Diagram: Q · K · V computation flow

<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 680 430">
<defs>
<marker id="arrow-en-qkv-flow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
<path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</marker>
</defs>
<!-- Step labels -->
<text x="48" y="22" font-size="12" fill="#6a6a64">① Token input</text>
<text x="330" y="22" text-anchor="middle" font-size="12" fill="#6a6a64">② Multiply by separate weight matrices (W) → generate Q·K·V</text>
<!-- Input token -->
<rect x="20" y="36" width="110" height="44" rx="8" fill="#412402" stroke="#BA7517" stroke-width="1"/>
<text x="75" y="62" text-anchor="middle" font-size="13" font-weight="500" fill="#FAC775">"it" token</text>
<line x1="131" y1="58" x2="178" y2="58" stroke="#6a6a64" stroke-width="1" marker-end="url(#arrow-en-qkv-flow)"/>
<!-- Q -->
<rect x="180" y="36" width="120" height="44" rx="8" fill="#26215C" stroke="#7F77DD" stroke-width="1"/>
<text x="240" y="52" text-anchor="middle" font-size="13" font-weight="500" fill="#CECBF6">Q</text>
<text x="240" y="70" text-anchor="middle" font-size="11" fill="#AFA9EC">"What am I looking for?"</text>
<!-- K -->
<rect x="310" y="36" width="110" height="44" rx="8" fill="#04342C" stroke="#1D9E75" stroke-width="1"/>
<text x="365" y="52" text-anchor="middle" font-size="13" font-weight="500" fill="#9FE1CB">K</text>
<text x="365" y="70" text-anchor="middle" font-size="11" fill="#5DCAA5">"What do I have?"</text>
<!-- V -->
<rect x="430" y="36" width="110" height="44" rx="8" fill="#4A1B0C" stroke="#D85A30" stroke-width="1"/>
<text x="485" y="52" text-anchor="middle" font-size="13" font-weight="500" fill="#F5C4B3">V</text>
<text x="485" y="70" text-anchor="middle" font-size="11" fill="#F0997B">"Actual information"</text>
<!-- Step 3 -->
<text x="340" y="106" text-anchor="middle" font-size="12" fill="#6a6a64">③ Dot product of Q and all tokens' K → similarity score</text>
<line x1="240" y1="80" x2="240" y2="124" stroke="#7F77DD" stroke-width="1" marker-end="url(#arrow-en-qkv-flow)"/>
<line x1="365" y1="80" x2="365" y2="124" stroke="#1D9E75" stroke-width="1" marker-end="url(#arrow-en-qkv-flow)"/>
<!-- Score box -->
<rect x="140" y="126" width="340" height="52" rx="8" fill="#272725" stroke="#444441" stroke-width="0.5"/>
<text x="310" y="146" text-anchor="middle" font-size="14" font-weight="500" fill="#e8e6de">Q · K = similarity score</text>
<text x="310" y="164" text-anchor="middle" font-size="12" fill="#a8a69e">the: 0.3 · robot: 1.2 · cup: 4.1 · picked: 0.5</text>
<!-- Step 4 -->
<text x="340" y="202" text-anchor="middle" font-size="12" fill="#6a6a64">④ Softmax → convert to probability weights summing to 1</text>
<line x1="310" y1="178" x2="310" y2="210" stroke="#6a6a64" stroke-width="1" marker-end="url(#arrow-en-qkv-flow)"/>
<!-- Attention weights box -->
<rect x="140" y="212" width="340" height="52" rx="8" fill="#272725" stroke="#444441" stroke-width="0.5"/>
<text x="310" y="232" text-anchor="middle" font-size="14" font-weight="500" fill="#e8e6de">Attention weights</text>
<text x="310" y="250" text-anchor="middle" font-size="12" fill="#a8a69e">the: 0.04 · robot: 0.09 · cup: 0.82 · picked: 0.05</text>
<!-- Step 5 -->
<text x="340" y="288" text-anchor="middle" font-size="12" fill="#6a6a64">⑤ Weights × V → weighted sum → final output</text>
<!-- V dashed arrow -->
<path d="M485 80 L485 260 L484 292" stroke="#D85A30" stroke-width="1" stroke-dasharray="4 3" fill="none"/>
<line x1="484" y1="292" x2="400" y2="298" stroke="#D85A30" stroke-width="1" marker-end="url(#arrow-en-qkv-flow)"/>
<line x1="310" y1="264" x2="310" y2="296" stroke="#6a6a64" stroke-width="1" marker-end="url(#arrow-en-qkv-flow)"/>
<!-- Output box -->
<rect x="140" y="298" width="340" height="52" rx="8" fill="#412402" stroke="#BA7517" stroke-width="1"/>
<text x="310" y="318" text-anchor="middle" font-size="14" font-weight="500" fill="#FAC775">Final output vector</text>
<text x="310" y="336" text-anchor="middle" font-size="12" fill="#EF9F27">"it" strongly referencing "cup"</text>
<!-- Winner callout -->
<rect x="548" y="188" width="118" height="120" rx="8" fill="#272725" stroke="#444441" stroke-width="0.5"/>
<text x="607" y="210" text-anchor="middle" font-size="12" fill="#a8a69e">The "winner"</text>
<text x="607" y="228" text-anchor="middle" font-size="12" fill="#a8a69e">you mentioned —</text>
<text x="607" y="246" text-anchor="middle" font-size="12" fill="#a8a69e">softmax amplifies</text>
<text x="607" y="264" text-anchor="middle" font-size="12" fill="#a8a69e">high scores so the</text>
<text x="607" y="282" text-anchor="middle" font-size="12" fill="#a8a69e">winner stands out</text>
<line x1="480" y1="238" x2="546" y2="238" stroke="#444441" stroke-width="0.5" stroke-dasharray="3 3" fill="none"/>
<!-- Bottom legend -->
<text x="340" y="396" text-anchor="middle" font-size="12" fill="#6a6a64">Q·K dot product = how similarly two vectors point = similarity</text>
<text x="340" y="416" text-anchor="middle" font-size="12" fill="#6a6a64">Softmax = converts scores to probabilities, sharpens high values</text>
</svg>


---

## Q · K · V (high level)

- **Q (Query)**: what this token is looking for
- **K (Key)**: what each token offers
- **V (Value)**: the actual information to aggregate

---

## RNN vs Transformer (practical takeaway)

- RNNs compress information into a recurrent hidden state, which can dilute long-range dependencies.
- Transformers use direct token-to-token interactions, which is friendlier to long-range reasoning and modern GPU scaling.

---

## See also

- [LLM](../03-llm/)
- [VLM](../04-vlm/)
- [VLA](../05-vla/)

---

## Food for Thought

- Robotics “success” isn’t just token-level accuracy: models must learn control-relevant representations, so you may need objectives and evaluation signals that reflect action quality, not only language metrics.
- Attention-based models are powerful but can fail under distribution shift (new scenes, new robots, new toolchains); if you treat failures as first-class, you can design better interfaces (schemas + constraints) around the model.
- The big opportunity is to connect fundamental training/attention mechanics to product constraints (latency, determinism, and safety gating), so scaling theory becomes deployment engineering.

