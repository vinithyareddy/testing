ngAfterViewInit() {
  const globeDiv = this.globeContainer.nativeElement;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(globeDiv.offsetWidth, globeDiv.offsetHeight);
  globeDiv.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    globeDiv.offsetWidth / globeDiv.offsetHeight,
    0.1,
    1000
  );
  camera.position.z = this.currentZoom;

  this.controls = new OrbitControls(camera, renderer.domElement);
  this.controls.enableDamping = true;
  this.controls.rotateSpeed = 0.5;
  this.controls.zoomSpeed = 0.8;

  // ✅ Add a perfect base sphere to keep silhouette round
  const sphereGeometry = new THREE.SphereGeometry(RADIUS, 64, 64);
  const sphereMaterial = new THREE.MeshPhongMaterial({
    color: new THREE.Color(DEFAULT_GLOBE_COLOR),
    shininess: 10
  });
  const baseSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  scene.add(baseSphere);

  // Globe polygons (keep Version B logic)
  this.globe = new Globe()
    .showGlobe(false) // ✅ hide default fill (use baseSphere instead)
    .showGraticules(false);

  this.countries = topojson.feature(
    worldData as any,
    (worldData as any).objects.countries
  ) as unknown as FeatureCollection<Geometry, any>;

  this.globe.polygonsData(this.countries.features);

  scene.add(this.globe);

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 1.2));
  const dir = new THREE.DirectionalLight(0xffffff, 0.8);
  dir.position.set(5, 3, 5);
  scene.add(dir);

  // ✅ keep your tooltip logic here...
  const tooltip = document.createElement('div');
  tooltip.style.position = 'absolute';
  tooltip.style.pointerEvents = 'none';
  tooltip.style.background = 'rgba(0,0,0,0.85)';
  tooltip.style.color = '#fff';
  tooltip.style.padding = '6px 12px';
  tooltip.style.borderRadius = '6px';
  tooltip.style.fontSize = '13px';
  tooltip.style.zIndex = '10';
  tooltip.style.display = 'none';
  globeDiv.appendChild(tooltip);

  // ✅ all your HTTP data loading, applyColors, handleHover logic stays unchanged...

  const animate = () => {
    requestAnimationFrame(animate);
    this.controls.update();
    renderer.render(scene, camera);
  };
  animate();
}
