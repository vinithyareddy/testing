// Render offscreen first
const offscreenSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
offscreenSvg.setAttribute('width', '100%');
offscreenSvg.setAttribute('height', '100%');
offscreenSvg.setAttribute('viewBox', `0 0 ${width} ${height}`);
offscreenSvg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

// Use D3 on the offscreen SVG
this.svg = d3.select(offscreenSvg);

// ... rest of your defs, circle, and path drawing logic stays unchanged ...

// At the very end of initializeGlobe()
globeDiv.innerHTML = ''; // clear old
globeDiv.appendChild(offscreenSvg); // paint all at once
