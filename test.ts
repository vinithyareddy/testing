focusOnCountry(country: CountrySkill) {
  if (!country) return;
  this.isFocusing = true;

  // base position from lat/lng
  const basePos = this.latLngToVector3(country.lat, country.lng, RADIUS);

  // normalize target direction
  const targetDir = basePos.clone().normalize();

  // camera looks down -Z in its local space
  const cameraForward = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);

  // quaternion to rotate globe so that country aligns with camera forward
  const q = new THREE.Quaternion().setFromUnitVectors(targetDir, cameraForward);

  // apply rotation while preserving upright Y
  this.globeGroup.quaternion.premultiply(q);

  // keep controls centered
  this.controls.target.set(0, 0, 0);
  this.controls.update();

  // add a highlight pin (on globe surface)
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
