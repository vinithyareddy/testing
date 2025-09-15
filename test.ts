focusOnCountry(country: CountrySkill) {
  if (!country) return;

  this.isFocusing = true;

  // base position from lat/lng
  const basePos = this.latLngToVector3(country.lat, country.lng, RADIUS);

  // compute direction from globe center to country
  const targetDir = basePos.clone().normalize();

  // get current "front" direction of globe (Z axis in globeGroup’s local space)
  const currentDir = new THREE.Vector3(0, 0, 1).applyQuaternion(this.globeGroup.quaternion);

  // quaternion to rotate currentDir → targetDir
  const q = new THREE.Quaternion().setFromUnitVectors(currentDir, targetDir);

  // rotate globeGroup
  this.globeGroup.quaternion.premultiply(q);

  this.controls.update();

  // add highlight marker (attach to globeGroup so it rotates with pins)
  const highlight = new THREE.Mesh(
    new THREE.SphereGeometry(2.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
  );
  highlight.position.copy(basePos);
  this.globeGroup.add(highlight); // ✅ add to globeGroup

  setTimeout(() => {
    this.globeGroup.remove(highlight);
    this.isFocusing = false;
  }, 2000);
}
