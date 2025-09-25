private initializeGlobe() {
  const globeDiv = this.globeContainer.nativeElement;
  const width = globeDiv.offsetWidth;
  const height = globeDiv.offsetHeight;

  // THREE.js setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
  camera.position.z = 600;

  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(width, height);
  globeDiv.appendChild(renderer.domElement);

  // Load texture (Natural Earth shaded relief)
  const texture = new THREE.TextureLoader().load('assets/images/natural-earth-2.png');
  const globe = new THREE.Mesh(
    new THREE.SphereGeometry(this.currentRadius, 64, 64),
    new THREE.MeshBasicMaterial({ map: texture })
  );
  scene.add(globe);

  // Setup D3 projection for labels
  this.projection = d3.geoOrthographic()
    .scale(this.currentRadius)
    .translate([width / 2, height / 2])
    .clipAngle(90);

  this.path = d3.geoPath().projection(this.projection);

  // SVG overlay for labels
  d3.select(globeDiv).selectAll("svg").remove();
  this.svg = d3.select(globeDiv)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("position", "absolute")
    .style("top", "0")
    .style("left", "0")
    .style("pointer-events", "none");

  // Animation loop
  const animate = () => {
    requestAnimationFrame(animate);

    // Rotate globe
    globe.rotation.y += 0.002;

    // Sync projection rotation with Three.js globe
    const rotation = globe.rotation.y * (180 / Math.PI);
    this.projection.rotate([rotation, 0]);

    // Redraw labels
    this.updateCountryLabels();
    this.updateStateLabels();

    renderer.render(scene, camera);
  };
  animate();
}
