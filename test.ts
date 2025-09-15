focusOnCountry(country: CountrySkill) {
  if (!country) return;
  this.isFocusing = true;

  // base position in globe local space
  const basePos = this.latLngToVector3(country.lat, country.lng, RADIUS);

  // desired direction (vector from globe center to country)
  const targetDir = basePos.clone().normalize();

  // camera forward direction in world space
  const camDir = new THREE.Vector3();
  this.camera.getWorldDirection(camDir);

  // compute rotation: rotate globe so country faces camera
  const q = new THREE.Quaternion().setFromUnitVectors(targetDir, camDir.negate());

  // apply rotation to globeGroup (pins + labels rotate with it)
  this.globeGroup.quaternion.premultiply(q);

  // keep orbit controls pivot at globe center
  this.controls.target.set(0, 0, 0);
  this.controls.update();

  // add a temporary red highlight pin at that country's local position
  const highlight = new THREE.Mesh(
    new THREE.SphereGeometry(2.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
  );
  highlight.position.copy(basePos); // still local to globeGroup
  this.globeGroup.add(highlight);

  setTimeout(() => {
    this.globeGroup.remove(highlight);
    this.isFocusing = false;
  }, 2000);
}
