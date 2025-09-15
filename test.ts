focusOnCountry(country: CountrySkill) {
  if (!country) return;

  this.isFocusing = true;

  // base position from lat/lng → attach to globe surface
  const basePos = this.latLngToVector3(country.lat, country.lng, RADIUS);

  // desired direction (where country is)
  const targetDir = basePos.clone().normalize();

  // current "front" direction of the globe (Z axis)
  const currentDir = new THREE.Vector3(0, 0, 1).applyQuaternion(this.globeGroup.quaternion);

  // compute rotation needed
  const q = new THREE.Quaternion().setFromUnitVectors(currentDir, targetDir);

  // rotate globe
  this.globeGroup.quaternion.premultiply(q);

  // controls always orbit around center
  this.controls.target.set(0, 0, 0);
  this.controls.update();

  // highlight marker → must be inside globeGroup so it rotates with pins
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
