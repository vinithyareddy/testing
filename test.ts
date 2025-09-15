focusOnCountry(country: CountrySkill) {
  if (!country) return;

  this.isFocusing = true;

  // base position from lat/lng
  const basePos = this.latLngToVector3(country.lat, country.lng, RADIUS);

  // convert to world direction (no matrix yet, we’ll rotate globe)
  const direction = basePos.clone().normalize();

  // get current camera forward direction
  const camDir = new THREE.Vector3();
  this.camera.getWorldDirection(camDir);

  // compute quaternion rotation to align globe so that country faces camera
  const q = new THREE.Quaternion().setFromUnitVectors(direction, camDir.negate());

  this.globeGroup.quaternion.premultiply(q);

  // add highlight marker
  const highlight = new THREE.Mesh(
    new THREE.SphereGeometry(2.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
  );
  highlight.position.copy(basePos);
  this.scene.add(highlight);

  setTimeout(() => {
    this.scene.remove(highlight);
    this.isFocusing = false;
  }, 2000);
}
this.controls.target.set(0, 0, 0);
