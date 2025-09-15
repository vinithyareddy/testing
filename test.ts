focusOnCountry(country: CountrySkill) {
  if (!country) return;
  this.isFocusing = true;

  // base position from lat/lng (local globe space)
  const basePos = this.latLngToVector3(country.lat, country.lng, RADIUS);

  // direction from globe center to country
  const targetDir = basePos.clone().normalize();

  // camera forward (-Z in world space)
  const camDir = new THREE.Vector3();
  this.camera.getWorldDirection(camDir);

  // rotate so country faces camera
  const q = new THREE.Quaternion().setFromUnitVectors(targetDir, camDir.negate());
  this.globeGroup.quaternion.premultiply(q);

  // 🔹 Ensure globe's "up" is preserved (no upside-down)
  const up = new THREE.Vector3(0, 1, 0).applyQuaternion(this.globeGroup.quaternion);
  if (up.y < 0) {
    // if flipped, rotate 180° around camera forward axis
    this.globeGroup.rotateOnAxis(camDir, Math.PI);
  }

  // keep controls pivot centered
  this.controls.target.set(0, 0, 0);
  this.controls.update();

  // highlight red marker at the country
  const highlight = new THREE.Mesh(
    new THREE.SphereGeometry(2.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
  );
  highlight.position.copy(basePos);
  this.globeGroup.add(highlight);

  setTimeout(() => {
    this.globeGroup.remove(highlight);
    this.isFocusing = false;
  }, 2000);
}
