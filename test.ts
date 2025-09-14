ngAfterViewInit() {
  const globeDiv = this.globeContainer.nativeElement;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(globeDiv.offsetWidth, globeDiv.offsetHeight);
  globeDiv.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, globeDiv.offsetWidth / globeDiv.offsetHeight, 0.1, 1000);
  camera.position.z = this.currentZoom;

  this.controls = new OrbitControls(camera, renderer.domElement);
  this.controls.enableDamping = true;
  this.controls.rotateSpeed = 0.5;
  this.controls.zoomSpeed = 0.8;

  // three-globe
  this.globe = new Globe()
    .showGlobe(true)
    .showGraticules(false)
    .polygonAltitude(() => 0.001) // ✅ sit flush on sphere, tiny lift
    .polygonSideColor(() => 'rgba(0,0,0,0)'); // ✅ remove extrusion walls

  // base smooth sphere color
  this.globe.globeMaterial(
    new THREE.MeshPhongMaterial({
      color: new THREE.Color(DEFAULT_GLOBE_COLOR),
      shininess: 1
    })
  );

  this.countries = topojson.feature(
    worldData as any,
    (worldData as any).objects.countries
  ) as unknown as FeatureCollection<Geometry, any>;

  this.globe.polygonsData(this.countries.features);

  scene.add(this.globe);
  scene.add(new THREE.AmbientLight(0xffffff, 1.2));
  const dir = new THREE.DirectionalLight(0xffffff, 0.8);
  dir.position.set(5, 3, 5);
  scene.add(dir);

  // tooltip setup
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

  this.http.get<any>('assets/data/world-globe-data.json').subscribe(data => {
    this.laborData = data.countries.map((c: any) => ({
      country: c.name,
      region: c.region,
      cost: c.cost ?? Math.floor(Math.random() * 2),
      code: c.code,
      lat: c.lat,
      lng: c.lng,
      position: this.latLngToVector3(c.lat, c.lng, RADIUS)
    }));

    const minCost = d3.min(this.laborData, d => d.cost) || 0;
    const maxCost = d3.max(this.laborData, d => d.cost) || 1;
    this.countryColorScale = d3.scaleLinear<string>()
      .domain([minCost, maxCost])
      .range(COUNTRY_COLOR_RANGE);

    this.showRegionData();
    this.applyColors('region');

    // hover logic
    const handleHover = (event: MouseEvent) => {
      const mouse = new THREE.Vector2(
        (event.offsetX / renderer.domElement.clientWidth) * 2 - 1,
        -(event.offsetY / renderer.domElement.clientHeight) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObject(this.globe);
      if (intersects.length > 0) {
        const point = intersects[0].point;

        let closest: CountryCost | null = null;
        let minDist = Infinity;
        for (const c of this.laborData) {
          if (!c.position) continue;

          const rotatedPos = c.position.clone().applyMatrix4(this.globe.matrixWorld);
          const dist = point.distanceTo(rotatedPos);
          if (dist < minDist) {
            minDist = dist;
            closest = { ...c, position: rotatedPos };
          }
        }

        if (closest && closest.position) {
          const vector = closest.position.clone().project(camera);
          const x = (vector.x * 0.5 + 0.5) * renderer.domElement.clientWidth;
          const y = (-vector.y * 0.5 + 0.5) * renderer.domElement.clientHeight;

          tooltip.innerHTML = `<b>${closest.country}</b><br>Region: ${closest.region}<br>Avg Cost: $${closest.cost}`;
          tooltip.style.left = `${x + 15}px`;
          tooltip.style.top = `${y + 15}px`;
          tooltip.style.display = 'block';
          return;
        }
      }
      tooltip.style.display = 'none';
    };

    renderer.domElement.addEventListener('mousemove', handleHover);
    renderer.domElement.addEventListener('click', handleHover);
    renderer.domElement.addEventListener('mouseleave', () => {
      tooltip.style.display = 'none';
    });
  });

  const animate = () => {
    requestAnimationFrame(animate);
    this.controls.update();
    renderer.render(scene, camera);
  };
  animate();
}
