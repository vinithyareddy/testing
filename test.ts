private initializeGlobe() {
  const globeDiv = this.globeContainer.nativeElement;
  const width = globeDiv.offsetWidth;
  const height = globeDiv.offsetHeight;
  this.currentRadius = this.getResponsiveRadius();

  // --- Setup D3 projection for labels ---
  this.projection = d3.geoOrthographic()
    .scale(this.currentRadius)
    .translate([width / 2, height / 2])
    .clipAngle(90);

  this.path = d3.geoPath().projection(this.projection);

  // Clear any old svg
  d3.select(globeDiv).selectAll('svg').remove();

  // SVG overlay for labels, borders, tooltips
  this.svg = d3.select(globeDiv)
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet');

  // --- Three.js Globe ---
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.z = this.currentRadius * 3;

  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(width, height);
  globeDiv.appendChild(renderer.domElement);

  // Load your Natural Earth PNG texture
  const texture = new THREE.TextureLoader().load('assets/images/your-globe.png');
  const geometry = new THREE.SphereGeometry(this.currentRadius, 64, 64);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const globe = new THREE.Mesh(geometry, material);
  scene.add(globe);

  // --- Tooltip ---
  d3.select(globeDiv).selectAll('.globe-tooltip').remove();
  this.tooltip = d3.select(globeDiv)
    .append('div')
    .attr('class', 'globe-tooltip')
    .style('position', 'absolute')
    .style('pointer-events', 'none')
    .style('display', 'none');

  // --- Rotation Loop ---
  const animate = () => {
    requestAnimationFrame(animate);

    // Rotate globe
    globe.rotation.y += 0.002; // adjust speed

    // Sync D3 projection with globe rotation
    const rotationDeg = (globe.rotation.y * 180) / Math.PI;
    this.projection.rotate([rotationDeg, 0]);

    // Update overlays
    this.updateCountries();
    this.updateStates();

    renderer.render(scene, camera);
  };
  animate();

  // --- Setup interactions (drag/zoom still on SVG) ---
  this.setupInteractions();
}
