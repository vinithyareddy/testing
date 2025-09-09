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
  camera.position.z = 170;

  const globe: any = new Globe().showGlobe(true).showGraticules(false);

  (globe as any).globeMaterial(
    new THREE.MeshPhongMaterial({ color: 0x87cefa })
  );

  const getCost = (name: string) => {
    const found = this.laborData.find((d) => d.country === name);
    return found ? found.cost : null;
  };

  const getColor = (name: string) => {
    const cost = getCost(name);
    if (cost === null) return 'lightgrey';
    if (cost > 40) return '#08306b';
    if (cost > 20) return '#2171b5';
    if (cost > 10) return '#6baed6';
    return '#c6dbef';
  };

  const countries = topojson.feature(
    worldData as any,
    (worldData as any).objects.countries
  ) as unknown as FeatureCollection<Geometry, any>;

  globe
    .polygonsData(countries.features)
    .polygonCapColor((d: any) => getColor(d.properties.name))
    .polygonSideColor(() => 'rgba(0,0,0,0.1)')
    .polygonStrokeColor(() => '#111');

  scene.add(globe);

  // ✅ Tooltip
  const tooltip = document.createElement('div');
  tooltip.style.position = 'absolute';
  tooltip.style.background = 'white';
  tooltip.style.color = 'black';
  tooltip.style.padding = '4px 8px';
  tooltip.style.borderRadius = '4px';
  tooltip.style.pointerEvents = 'none';
  tooltip.style.display = 'none';
  document.body.appendChild(tooltip);

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  globeDiv.addEventListener('mousemove', (event: MouseEvent) => {
    const rect = globeDiv.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0) {
      const obj: any = intersects[0].object.__data; // polygon data
      if (obj && obj.properties) {
        const cost = getCost(obj.properties.name);
        tooltip.style.display = 'block';
        tooltip.style.left = event.pageX + 10 + 'px';
        tooltip.style.top = event.pageY + 10 + 'px';
        tooltip.innerHTML = `<b>${obj.properties.name}</b><br/>Average Cost: ${
          cost !== null ? '$' + cost : 'N/A'
        }`;
        return;
      }
    }
    tooltip.style.display = 'none';
  });

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 3, 5);
  scene.add(directionalLight);

  const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  };
  animate();
}
