focusOnCountry(country: CountrySkill) {
  if (!country) return;
  this.isFocusing = true;

  // base position from lat/lng
  const basePos = this.latLngToVector3(country.lat, country.lng, RADIUS);

  // desired direction (vector from center to country)
  const targetDir = basePos.clone().normalize();

  // current camera forward direction
  const camDir = new THREE.Vector3();
  this.camera.getWorldDirection(camDir);

  // compute rotation to align country with camera
  const q = new THREE.Quaternion().setFromUnitVectors(targetDir, camDir.negate());

  // rotate the globe so the country faces the camera
  this.globeGroup.quaternion.premultiply(q);

  // keep orbit controls pivot at globe center
  this.controls.target.set(0, 0, 0);
  this.controls.update();

  // add a temporary highlight marker
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
