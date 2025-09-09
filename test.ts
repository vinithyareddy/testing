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
  camera.position.z = 180;

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.rotateSpeed = 0.5;
  controls.zoomSpeed = 0.8;

  const globe: any = new Globe().showGlobe(true).showGraticules(false);
  (globe as any).globeMaterial(
    new THREE.MeshBasicMaterial({ color: new THREE.Color('#84c9f6') })
  );

  const countries = topojson.feature(
    worldData as any,
    (worldData as any).objects.countries
  ) as unknown as FeatureCollection<Geometry, any>;

  const getRegion = (countryName: string): string => {
    const northAmerica = ['United States of America', 'Canada', 'Mexico'];
    const southAmerica = ['Brazil', 'Argentina', 'Colombia'];
    if (northAmerica.includes(countryName)) return 'North America';
    if (southAmerica.includes(countryName)) return 'South America';
    return 'Other';
  };

  // ✅ Save laborData outside so `this` is not lost
  const laborData = this.laborData;

  globe
    .polygonsData(countries.features)
    .polygonCapColor((d: any) => {
      const region = getRegion(d.properties.name);
      return this.REGION_COLORS[region] || this.REGION_COLORS['Other'];
    })
    .polygonSideColor(() => 'rgba(0,0,0,0.2)')
    .polygonStrokeColor(() => '#111')
    // ✅ Tooltip works safely now
    .polygonLabel((d: any) => {
      const countryName = d.properties.name;
      const match = laborData.find(c => c.country === countryName);

      if (match) {
        return `
          <div style="padding:6px 10px; font-size:13px; color:#000; background:#fff; border-radius:4px;">
            <div style="font-weight:bold; margin-bottom:4px;">
              <img src="https://flagcdn.com/24x18/${match.code.toLowerCase()}.png"
                   style="width:20px; margin-right:6px; vertical-align:middle;" />
              ${match.country}
            </div>
            <div>Average Cost <b>$${match.cost}</b></div>
          </div>
        `;
      }
      return `<div style="padding:6px 10px; font-size:13px; color:#000; background:#fff; border-radius:4px;">${countryName}</div>`;
    });

  scene.add(globe);

  scene.add(new THREE.AmbientLight(0xffffff, 1.2));
  const dir = new THREE.DirectionalLight(0xffffff, 0.8);
  dir.position.set(5, 3, 5);
  scene.add(dir);

  const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  };
  animate();
}
