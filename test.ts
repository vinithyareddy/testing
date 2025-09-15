focusOnCountry(country: CountrySkill) {
  if (!country) return;
  this.isFocusing = true;

  // Base position from lat/lng (in globe local space)
  const basePos = this.latLngToVector3(country.lat, country.lng, RADIUS);

  // Step 1: direction to country
  const targetDir = basePos.clone().normalize();

  // Step 2: desired "lookAt" transform
  const m = new THREE.Matrix4();
  m.lookAt(new THREE.Vector3(0, 0, 0), targetDir, new THREE.Vector3(0, 1, 0));

  // Step 3: Convert to quaternion and apply to globe
  const q = new THREE.Quaternion().setFromRotationMatrix(m);
  this.globeGroup.setRotationFromQuaternion(q);

  // Keep OrbitControls pivot centered
  this.controls.target.set(0, 0, 0);
  this.controls.update();

  // Temporary red highlight
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
