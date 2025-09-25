private initializeGlobe() {
  const globeDiv = this.globeContainer.nativeElement;
  const width = globeDiv.offsetWidth;
  const height = globeDiv.offsetHeight;
  this.currentRadius = this.getResponsiveRadius();

  // --- D3 projection for labels ---
  this.projection = d3.geoOrthographic()
    .scale(this.currentRadius)
    .translate([width / 2, height / 2])
    .clipAngle(90);

  this.path = d3.geoPath().projection(this.projection);

  // --- Three.js globe ---
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
  camera.position.z = this.currentRadius * 2.2; // closer view

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);

  // Make sure no old canvas exists
  globeDiv.querySelectorAll('canvas').forEach(c => c.remove());
  globeDiv.querySelectorAll('svg').forEach(s => s.remove());

  // Append Three.js canvas first
  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.top = '0';
  renderer.domElement.style.left = '0';
  renderer.domElement.style.zIndex = '0';
  globeDiv.appendChild(renderer.domElement);

  // Load your PNG texture (make sure path is correct under /assets/)
  const texture = new THREE.TextureLoader().load('assets/images/your-globe.png');
  const geometry = new THREE.SphereGeometry(this.currentRadius, 128, 128);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const globe = new THREE.Mesh(geometry, material);
  scene.add(globe);

  // --- D3 SVG overlay (labels, tooltips) ---
  this.svg = d3.select(globeDiv)
    .append('svg')
    .style('position', 'absolute')
    .style('top', '0')
    .style('left', '0')
    .style('z-index', '1')
    .attr('width', width)
    .attr('height', height);

  // Tooltip container
  d3.select(globeDiv).selectAll('.globe-tooltip').remove();
  this.tooltip = d3.select(globeDiv)
    .append('div')
    .attr('class', 'globe-tooltip')
    .style('position', 'absolute')
    .style('pointer-events', 'none')
    .style('display', 'none');

  // --- Animation loop ---
  const animate = () => {
    requestAnimationFrame(animate);

    // Rotate globe
    globe.rotation.y += 0.002;

    // Sync D3 projection with globe rotation
    const rotationDeg = (globe.rotation.y * 180) / Math.PI;
    this.projection.rotate([rotationDeg, 0]);

    // Update overlays
    this.updateCountries();
    this.updateStates();

    renderer.render(scene, camera);
  };
  animate();

  // --- Interactions (drag, zoom, etc.) ---
  this.setupInteractions();
}
