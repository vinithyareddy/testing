const animate = () => {
  requestAnimationFrame(animate);

  if (this.isRotating && !this.isDragging && this.earthMesh) {
    this.earthMesh.rotation.y += ROTATION_SPEED * 0.005;
  }

  // 🔑 Sync D3 projection with Three.js rotation
  const rotation = this.earthMesh?.rotation.y || 0;
  this.projection.rotate([(-rotation * 180) / Math.PI, 0]); // radians → degrees
  this.updateCountryLabels();
  this.updateStateLabels();

  this.renderer?.render(this.scene!, this.camera!);
};


const earthTexture = loader.load('assets/images/globe-texture.png');

// Option 1: Exact texture (no shading/tint)
const material = new THREE.MeshBasicMaterial({ map: earthTexture });

// Option 2: Keep 3D shading but adjust lighting
// const material = new THREE.MeshPhongMaterial({ map: earthTexture });
// light.intensity = 0.6;
// this.scene.add(new THREE.AmbientLight(0x333333));
