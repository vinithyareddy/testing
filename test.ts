// 🌍 Globe setup
this.globe = new Globe().showGlobe(true).showGraticules(false);

// Load earth texture (relief + oceans)
const loader = new THREE.TextureLoader();
loader.load('assets/images/earth-blue.jpg',   // ✅ correct path
  (texture) => {
    this.globe.globeMaterial(
      new THREE.MeshPhongMaterial({
        map: texture,
        bumpMap: texture,
        bumpScale: 0.8,
        specular: new THREE.Color('grey'),
        shininess: 5
      })
    );
  },
  undefined,
  (err) => {
    console.error('❌ Error loading texture:', err);
  }
);
