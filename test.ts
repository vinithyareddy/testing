const ROTATION_SPEED = 0.002; // tweak this (smaller = slower)


const animate = () => {
  requestAnimationFrame(animate);

  // 🌍 Auto-rotate the globe
  if (this.globe) {
    this.globe.rotation.y += ROTATION_SPEED;
  }

  this.controls.update();
  renderer.render(scene, camera);
};
animate();
