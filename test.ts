const animate = () => {
  requestAnimationFrame(animate);

  this.globe.rotation.y += ROTATION_SPEED;
  this.controls.update();

  // ✅ Make labels always face the camera
  if (this.labelGroup) {
    this.labelGroup.children.forEach(obj => {
      obj.lookAt(this.camera.position);
    });
  }

  renderer.render(this.scene, this.camera);
};
