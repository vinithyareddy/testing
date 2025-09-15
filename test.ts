focusOnCountry(country: CountrySkill) {
  if (!country) return;
  this.isFocusing = true;

  // base position from lat/lng
  const basePos = this.latLngToVector3(country.lat, country.lng, RADIUS);

  // desired direction (country vector)
  const targetDir = basePos.clone().normalize();

  // get current camera forward direction
  const camDir = new THREE.Vector3();
  this.camera.getWorldDirection(camDir);

  // create a rotation matrix that looks from globe center → country
  const m = new THREE.Matrix4();
  m.lookAt(new THREE.Vector3(0, 0, 0), targetDir, new THREE.Vector3(0, 1, 0));

  // convert to quaternion
  const q = new THREE.Quaternion().setFromRotationMatrix(m);

  // apply only Y-axis rotation first (prevent upside-down flip)
  const euler = new THREE.Euler().setFromQuaternion(q, 'YXZ');
  euler.z = 0; // lock roll
  euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.x)); // clamp pitch

  this.globeGroup.setRotationFromEuler(euler);

  // controls orbit around globe center
  this.controls.target.set(0, 0, 0);
  this.controls.update();

  // highlight marker
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
